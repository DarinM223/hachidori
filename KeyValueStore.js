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

KeyValueStore.prototype.get = function get(username) {
  if (typeof username !== 'string') {
    throw new TypeError(`Error in KeyValueStore.get: \' ${ username } \' is not a string`);
  }

  return this.client.hgetallAsync(username).then(obj => {
    return Promise.resolve(_.object(_.map(obj, (value, key) => {
      return [key, JSONEncoder.decodeJSON(value)];
    })));
  });
};

KeyValueStore.prototype.set = function set(username, key, value) {
  if (typeof key !== 'string') {
    throw new TypeError(`Error in KeyValueStore.set: \' ${ key } \' is not a string`);
  }
  if (typeof value === 'undefined' || value === null) {
    throw new TypeError(`Error in KeyValueStore.set: \' ${ value } \' is either undefined or null`);
  }

  return this.client.hsetAsync(username, key, JSONEncoder.encodeJSON(value));
};

KeyValueStore.prototype.remove = function remove(username, key) {
  if (typeof key !== 'string') {
    throw new TypeError(`Error in KeyValueStore.remove: \' ${ key } \' is not a string`);
  }

  return this.client.hdelAsync(username, key);
};

