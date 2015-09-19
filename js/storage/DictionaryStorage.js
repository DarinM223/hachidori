'use strict';

/*
 * Synchronous storage using a `dictionary` that wraps asynchronous storage apis
 */

var StorageMethods = require('./StorageMethods.js');

/*
 * Expose a function that takes a Storage parameter and returns 
 * a new `DictionaryStorage`
 */
module.exports = function(Storage, StorageStrategy) {
  return new DictionaryStorage(Storage, StorageStrategy);
};

/**
 * @param {Object} Storage a wrapper to an asynchronous storage API
 * @param {Object} StorageWrapper a class that wraps the storage
 * @property {function(key: String): Object} Storage.get
 * @property {function(key: String, value: Object)} Storage.set
 * @property {function(key: String)} Storage.remove
 */
function DictionaryStorage(Storage, StorageStrategy) {
  this.storageMethods = new StorageMethods(Storage, StorageStrategy);
}

DictionaryStorage.prototype.init = function init() {
  return this.storageMethods.init((key, value) => (this.data[key] = value));
};
  
DictionaryStorage.prototype.setItem = function setItem(key, value) {
  this.data[key] = value;
  this.storageMethods.setItem(key, value);
};

DictionaryStorage.prototype.getItem = function getItem(key) {
  if (typeof(this.data[key]) === 'undefined') {
    this.data[key] = null;
    return null;
  } else {
    return this.data[key];
  }
};

DictionaryStorage.prototype.removeItem = function removeItem(key) {
  this.data[key] = null;
  this.storageMethods.removeItem(key);
};

