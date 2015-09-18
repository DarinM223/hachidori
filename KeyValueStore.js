'use strict';

/*
 * Encapulates the backend key/value store using Redis
 */

var Promise = require('bluebird')
  , _ = require('underscore')
  , JSONEncoder = require('./JSONEncoder.js');

/*
 * Expose `KeyValueStore`
 */
module.exports = KeyValueStore;

/**
 * Creates a new anime key value store using a Redis Client
 */
function KeyValueStore(client) {
  Promise.promisifyAll(client);
  this.client = client;
}

KeyValueStore.prototype.get = function get(key) {
  if (typeof key !== 'string') {
    throw new TypeError(`Error in KeyValueStore.get: \' ${ key } \' is not a string`);
  }

  return this.client.typeAsync(key).then((type) => {
    switch (type) {
      case 'none':
        return Promise.resolve(null);
      case 'string':
        return this.client.getAsync(key).then(item => Promise.resolve(JSONEncoder.decodeJSON(item)));
      case 'list':
        return this.client.lrangeAsync(key, 0, -1).then(list => {
          return Promise.resolve(list.map(item => JSONEncoder.decodeJSON(item)));
        });
      case 'hash':
        return this.client.hgetallAsync(key).then(obj => {
          return Promise.resolve(_.object(_.map(obj, (value, key) => {
            return [key, JSONEncoder.decodeJSON(value)];
          })));
        });
    }
  });
};

KeyValueStore.prototype.set = function set(key, value) {
  if (typeof key !== 'string') {
    throw new TypeError(`Error in KeyValueStore.set: \' ${ key } \' is not a string`);
  }
  if (typeof value === 'undefined' || value === null) {
    throw new TypeError(`Error in KeyValueStore.set: \' ${ value } \' is either undefined or null`);
  }

  if (typeof value === 'object' && value.constructor === Array) {
    let multi = this.client.multi();
    for (let listItem of value) {
      let listItemJSON = JSONEncoder.encodeJSON(listItem);
      multi.rpush(key, listItemJSON);
    }
    return Promise.promisify(multi.exec);
  } else if (typeof value === 'object') {
    let objectItemJSON = {};
    for (let key of Object.keys(value)) {
      objectItemJSON[key] = JSONEncoder.encodeJSON(value[key]);
    }
    return this.client.hmsetAsync(key, objectItemJSON);
  } else {
    return this.client.setAsync(key, JSONEncoder.encodeJSON(value));
  }
};

KeyValueStore.prototype.remove = function remove(key) {
  if (typeof key !== 'string') {
    throw new TypeError(`Error in KeyValueStore.remove: \' ${ key } \' is not a string`);
  }
  return this.client.delAsync(key);
};

