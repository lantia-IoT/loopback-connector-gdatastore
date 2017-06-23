var util = require('util');
var assert = require('assert');
var debug = require('debug')('loopback:connector:gdatastore');
const Connector = require('loopback-connector').Connector;
const Datastore = require('@google-cloud/datastore');
const iterator = require('./iterator');

module.exports = GDataStore;

//Create an instance of the connector with the given `settings`.
function GDataStore(settings) {
    assert(typeof settings === 'object', 'cannot initiaze ' +
        'GDataStore without a settings object');
    Connector.call(this, 'gdatastore', settings);
    this.datastore = Datastore({
        projectId: settings.projectId,
        namespace: settings.namespace
    });
}
// Set up the prototype inheritence
util.inherits(GDataStore, Connector);

GDataStore.initialize = function (dataSource, callback) {
    dataSource.connector = new GDataStore(dataSource.settings);
    dataSource.connector.connect();
    process.nextTick(callback);
};

GDataStore.prototype.relational = false;

GDataStore.prototype.connect = function (callback) {
    if (callback) { callback(); }
};

GDataStore.prototype.disconnect = function (callback) {
    if (callback) { callback(); }
};

GDataStore.prototype.all = function (model, filter, callback) {
    this.find(model, filter, callback);
};

GDataStore.prototype.find = function (model, filter, callback) {
    debug('finding: %s %s', model, JSON.stringify(filter));
    const Query = require('./query');
    const ds = this.datastore;
    const id = this.idName(model);
    let query = new Query(ds, model, id);
    query.filter(filter);
    query.run((errors, result, cursor) => {
        if (callback === null || callback === undefined) {
            return;
        }
        if (errors) {
            return callback(errors);
        }
        // Done
        callback(null, result);
    });
};