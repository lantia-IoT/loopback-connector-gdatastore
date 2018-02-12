/* eslint-disable no-unused-vars */
const debug = require('debug')('loopback:connector:gdatastore');
const Connector = require('loopback-connector').Connector;
const Datastore = require('@google-cloud/datastore');
const assert = require('assert');
const util = require('util');

module.exports = GDataStore;

//Create an instance of the connector with the given `settings`.
function GDataStore(settings) {
    assert(typeof settings === 'object', 'cannot initiaze ' +
        'GDataStore without a settings object');
    Connector.connector = settings;
    process.env['DEFAULT_NAMESPACE'] = settings.namespace;
    Connector.call(this, 'gdatastore', settings);
    this.datastore = Datastore({
        projectId: settings.projectId,
        namespace: settings.namespace
    });
}

// Set up the prototype inheritance
util.inherits(GDataStore, Connector);

GDataStore.initialize = function (dataSource, callback) {
    dataSource.connector = new GDataStore(dataSource.settings);
    dataSource.connector.connect();
    process.nextTick(callback);
};

GDataStore.prototype.relational = false;

GDataStore.prototype.createQuery = function (model, namespace, kind, callback) {
    const Query = require('./query');
    // Multi-tenant
    if (typeof namespace === 'undefined') {
        this.datastore.namespace = process.env.DEFAULT_NAMESPACE;
    } else {
        this.datastore.namespace = namespace;
    }
    const ds = this.datastore;

    if (typeof kind === 'undefined') {
        const idName = this.idName(model);
        const definition = this.getModelDefinition(model);
        callback(new Query(ds, model, idName, definition));
    } else {
        const idName = this.idName(kind);
        const definition = this.getModelDefinition(kind);
        callback(new Query(ds, kind, idName, definition));
    }


};

GDataStore.prototype.callback = function (errors, result, callback) {
    if (callback === null || callback === undefined) {
        return;
    }
    if (errors) {
        return callback(errors);
    }
    // Done
    callback(null, result);
};

GDataStore.prototype.connect = function (callback) {
    if (callback) { callback(); }
};

GDataStore.prototype.disconnect = function (callback) {
    if (callback) { callback(); }
};

GDataStore.prototype.all = function (model, filter, options, callback) {

    if (filter && filter.where && filter.where.id) { //GET with id operation
        this.findById(model, filter.where.id, options, callback);
    } else { //GET all operation
        this.find(model, filter, options, callback);
    }

};

GDataStore.prototype.find = function (model, filter, options, callback) {
    debug('finding: %s %s', model, JSON.stringify(filter));
    if(options.kind) {
        model = options.kind;
    }
    this.createQuery(model, options.namespace, options.kind, (query) => {
        query.order(filter);
        query.filter(filter);
        query.select((errors, result, cursor) => {
            this.callback(errors, result, callback);
        });
    });
};

GDataStore.prototype.findById = function (model, id, options, callback) {

    debug('finding: %s by id %s', model, id);
    if(options.kind) {
        model = options.kind;
    }

    this.createQuery(model, options.namespace, options.kind, (query) => {
        query.findById(id, (errors, result) => {
            this.callback(errors, result, callback);
        });
    });
};

GDataStore.prototype.create = function (model, data, options, callback) {
    debug('create: %s %s %s', model, JSON.stringify(data),
        JSON.stringify(options));
    assert(data, 'Cannot save an empty entity into the database');
    if(options.kind) {
        model = options.kind;
    }
    this.createQuery(model, options.namespace, options.kind, (query) => {
        debug('create: executing %s', JSON.stringify(data));
        query.create(data, (errors, result) => {
            this.callback(errors, result, callback);
        });
    });
};

GDataStore.prototype.update = function (model, id, data, options, callback) {
    debug('update: %s %s %s %s', model, id, JSON.stringify(data));
    id = id.where.id; // se pasa únicamente el id del device
    assert(id, 'Cannot update an entity without an existing id');
    if(options.kind) {
        model = options.kind;
    }
    this.createQuery(model, options.namespace, options.kind, (query) => {
        query.update(id, data, (errors, result) => {
            this.callback(errors, result, callback);
        });
    });

};

GDataStore.prototype.destroyAll = function (model, filter, options, callback) {
    debug('destroyAll: %s %s %s %s', model, JSON.stringify(filter),
        JSON.stringify(options));
    assert(filter, 'Cannot delete an entity without a filter');
    if(options.kind) {
        model = options.kind;
    }
    this.createQuery(model, options.namespace, options.kind, (query) => {
        let id = filter[this.idName(model)];
        query.deleteById(id, (errors, result) => {
            this.callback(errors, result, callback);
        });
    });
}
