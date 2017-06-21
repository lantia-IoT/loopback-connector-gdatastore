var assert = require('assert');
var debug = require('debug')('loopback:connector:gdatastore');

exports.initialize = function initializeDataSource(dataSource, callback) {
    // callback && process.nextTick(callback);
    if (callback) {
        dataSource.connector.connect(callback);
    }
}

module.exports = GDataStore;

/**
 * Create an instance of the connector with the given `settings`.
 */
function GDataStore(settings) {
    assert(typeof settings === 'object', 'cannot initiaze GDataStore without a settings object');
    // this.client = settings.client;
    // this.adapter = settings.adapter || 'rest';
    // this.protocol = settings.protocol || 'http';
    // this.root = settings.root || '';
    // this.host = settings.host || 'localhost';
    // this.port = settings.port || 3000;
    // this.remotes = remoting.create();
    // this.name = 'remote-connector';

    // if (settings.url) {
    //     this.url = settings.url;
    // } else {
    //     this.url = this.protocol + '://' + this.host + ':' + this.port + this.root;
    // }

    // handle mixins in the define() method
    // var DAO = this.DataAccessObject = function () {
    // };
}

GDataStore.prototype.connect = function () {
    console.log('Connecting data store');
    //   this.remotes.connect(this.url, this.adapter);
};

GDataStore.initialize = function (dataSource, callback) {
    var connector = dataSource.connector = new GDataStore(dataSource.settings);
    connector.connect();
    process.nextTick(callback);
};

GDataStore.prototype.executeSQL = function (sql, params, options, callback) {
    console.log('Executing query...');
};

GDataStore.prototype.all = function (model, filter, callback) {
    this.find(model, filter, callback);
};

GDataStore.prototype.find = function (model, filter, callback) {
    // Done
    callback(null, [{
        "id": 1,
        "value": "valor1"
    }, {
        "id": 2,
        "value": "valor2"
    }, {
        "id": 3,
        "value": "valor3"
    }]);
};