/* eslint-disable no-unused-vars */
const debug = require('debug')('loopback:connector:gcdatastore');
const Connector = require('loopback-connector').Connector;
const Datastore = require('@google-cloud/datastore');
const assert = require('assert');
const util = require('util');

module.exports = GCDataStore;

function GCDataStore(settings) {
    assert(typeof settings === 'object', 'cannot initiaze ' +
        'GCDataStore without a settings object');
    Connector.connector = settings;
    process.env['DEFAULT_NAMESPACE'] = settings.namespace;
    Connector.call(this, 'gcdatastore', settings);
    this.datastore = Datastore({
        projectId: settings.projectId,
        namespace: settings.namespace
    });
}

util.inherits(GCDataStore, Connector);

GCDataStore.initialize = function (dataSource, callback) {
    dataSource.connector = new GCDataStore(dataSource.settings);
    dataSource.connector.connect();
    process.nextTick(callback);
};

GCDataStore.prototype.relational = false;

GCDataStore.prototype.createQuery = function (model, namespace, callback) {
    const Query = require('./query');

    // Multi-tenant
    if (typeof namespace === 'undefined') {
        this.datastore.namespace = process.env.DEFAULT_NAMESPACE;
    } else {
        this.datastore.namespace = namespace;
    }
    const ds = this.datastore;
    const idName = this.idName(model);
    const definition = this.getModelDefinition(model);
    callback(new Query(ds, model, idName, definition));
};

GCDataStore.prototype.callback = function (errors, result, callback) {
    if (callback === null || callback === undefined) {
        return;
    }
    if (errors) {
        return callback(errors);
    }
    // Done
    callback(null, result);
};

GCDataStore.prototype.connect = function (callback) {
    if (callback) { callback(); }
};

GCDataStore.prototype.disconnect = function (callback) {
    if (callback) { callback(); }
};

GCDataStore.prototype.all = function (model, filter, options, callback) {
    if (filter && filter.where && filter.where.id) { //GET with id operation
        this.findById(model, filter.where.id, options, callback);
    } else {
        this.find(model, filter, options, callback);
    }

};

GCDataStore.prototype.find = function (model, filter, options, callback) {
    debug('finding: %s %s', model, JSON.stringify(filter));

    this.createQuery(model, options.namespace, (query) => {
        query.order(filter);
        query.filter(filter);
        query.select((errors, result, cursor) => {
            this.callback(errors, result, callback);
        });
    });
};

GCDataStore.prototype.findById = function (model, id, options, callback) {
    debug('finding: %s by id %s', model, id);

    this.createQuery(model, options.namespace, (query) => {
        query.findById(id, (errors, result) => {
            this.callback(errors, result, callback);
        });
    });
};

GCDataStore.prototype.create = function (model, data, options, callback) {
    debug('create: %s %s %s', model, JSON.stringify(data),
        JSON.stringify(options));

    assert(data, 'Cannot save an empty entity into the database');
    this.createQuery(model, options.namespace, (query) => {
        debug('create: executing %s', JSON.stringify(data));
        query.create(data, (errors, result) => {
            this.callback(errors, result, callback);
        });
    });
};

GCDataStore.prototype.update = function (model, id, data, options, callback) {
    debug('update: %s %s %s %s', model, id, JSON.stringify(data));
    id = id.where.id;
    assert(id, 'Cannot update an entity without an existing id');
    this.createQuery(model, options.namespace, (query) => {
        query.update(id, data, (errors, result) => {
            this.callback(errors, result, callback);
        });
    });

};

GCDataStore.prototype.replaceById = function (model, id, data, options, callback) {
    debug('replaceById: %s %s %s %s', model, id, JSON.stringify(data),
        JSON.stringify(options));

    assert(id, 'Cannot update an entity without an existing id');
    this.createQuery(model, (query) => {
        query.update(id, data, (errors, result) => {
            this.callback(errors, result, callback);
        });
    });
};

GCDataStore.prototype.destroyAll = function (model, filter, options, callback) {
    debug('destroyAll: %s %s %s %s', model, JSON.stringify(filter),
        JSON.stringify(options));
    assert(filter, 'Cannot delete an entity without a filter');
    this.createQuery(model, options.namespace, (query) => {
        let id = filter[this.idName(model)];
        query.deleteById(id, (errors, result) => {
            this.callback(errors, result, callback);
        });
    });
}
