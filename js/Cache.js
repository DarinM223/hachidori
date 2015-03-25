'use strict';

function Cache() {
  this._cache = {};
}

/**
 * Sets a key to a value in the cache (except null)
 * @param {string} key
 * @param {Object} value
 */
Cache.prototype.set = function(key, value) {
  if (typeof(key) !== 'string') {
    throw new TypeError('Parameter key has to be a string!');
  }

  if (value !== null) {
    this._cache[key] = value;
  }
};

/**
 * Removes a key in the cache (sets it to null)
 * @param {string} key
 */
Cache.prototype.remove = function(key) {
  if (typeof(key) !== 'string') {
    throw new TypeError('Parameter key has to be a string!');
  }

  this._cache[key] = null;
};

/**
 * Checks if a key is set in the cache
 * @param {string} key 
 * @return {boolean} true if the key is in the cache, false otherwise
 */
Cache.prototype.inCache = function(key) {
  if (typeof(key) !== 'string') {
    throw new TypeError('Parameter key has to be a string!');
  }

  var result = this._cache[key];
  if (typeof(result) === 'undefined' || result === null) {
    return false;
  }
  return true;
};

/**
 * Gets the value of the key
 * @param {string} key
 * @return {Object} the value of the key
 */
Cache.prototype.get = function(key) {
  if (typeof(key) !== 'string') {
    throw new TypeError('Parameter key has to be a string!');
  }

  return this._cache[key];
};

export default Cache;
