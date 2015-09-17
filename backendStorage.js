'use strict';

/*
 * Encapulates the backend key/value store using Redis
 */

var client = require('redis').createClient(process.env.REDIS_URL);

/*
 * Expose `KeyValueStore`
 */
module.exports = KeyValueStore;

client.on('error', function(err) {
  console.log('Redis Error: ', err);
});

/**
 * Creates a new anime key value store using a Redis Client
 */
function KeyValueStore(client) {
  this.client = client;
}

KeyValueStore.prototype.get = function get(key) {
  if (typeof key !== 'string') {
    throw new Error(`Error in KeyValueStore.get: \' ${ key } \' is not a string`);
  }

  // TODO(darin): retrieve key from redis return it as the appropriate data type
};

KeyValueStore.prototype.set = function set(key, value) {
  if (typeof key !== 'string') {
    throw new Error(`Error in KeyValueStore.set: \' ${ key } \' is not a string`);
  }
  if (typeof value === 'undefined' || value === null) {
    throw new Error(`Error in KeyValueStore.set: \' ${ value } \' is either undefined or null`);
  }
  // TODO(darin): check value type and set the key using the appropriate redis data structure
};

KeyValueStore.prototype.remove = function remove(key) {
  if (typeof key !== 'string') {
    throw new Error(`Error in KeyValueStore.remove: \' ${ key } \' is not a string`);
  }
  // TODO(darin): remove the value from redis
};

