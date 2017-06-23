var debug = require('debug')('loopback:connector:gdatastore');
const iterator = require('./iterator');

module.exports = Query;

function Query(ds, model, id) {
    this.id = id;
    this.ds = ds;
    this.model = model;
    this.query = ds.createQuery(model);
}

Query.prototype.filter = function (filters) {
    let ds = this.ds;
    // Where clauses (including conditions on primary key)
    if (filters !== undefined && filters.where !== undefined) {
        iterator(filters.where, (val, key) => {
            this.where(val, key);
        });
    }
    // Limit restriction
    if (undefined !== filters.limit) {
        debug('find: adding limit %d', filters.limit);
        this.query.limit(filters.limit);
    }
    // Offset restriction
    if (undefined !== filters.offset) {
        debug('find: adding offset %d', filters.offset);
        this.query.offset(filters.offset);
    }
}
Query.prototype.where = function (data, name) {
    data = data === undefined || data === null ? "" : data;
    // How to handle?
    if (this.id == name) {
        debug('find: adding filter by __key__ = %s', data);
        let key = this.ds.key([this.model, data]);
        this.query.filter('__key__', '=', key);
    } else if ('and' === name) {
        iterator(data, (val, key) => {
            this.where(val, key);
        });
    } else if ('or' === name) {
        debug('find: UNSUPPORTED OR CLAUSE %s', JSON.stringify(data));
    } else {
        debug('find: adding filter %s = %s', name, JSON.stringify(data));
        this.query.filter(name, '=', data);
    }
}

Query.prototype.run = function (callback) {
    this.ds.runQuery(this.query, callback);
}