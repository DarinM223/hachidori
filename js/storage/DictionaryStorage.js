'use strict';

/*
 * Synchronous storage using a `dictionary` that wraps asynchronous storage apis
 */

var WorkQueue = require('../WorkQueue.js')
  , AsyncStorageWrapper = require('./AsyncStorageWrapper.js');

/*
 * Expose a function that takes a Storage parameter and returns 
 * a new `DictionaryStorage`
 */
module.exports = function(Storage) {
  return new DictionaryStorage(Storage);
};

// TODO(darin): replace with singleton
var taskQueue = new WorkQueue();

/**
 * @param {Object} Storage a wrapper to an asynchronous storage API
 * @property {function(key: String): Object} Storage.get
 * @property {function(key: String, value: Object)} Storage.set
 * @property {function(key: String)} Storage.remove
 */
function DictionaryStorage(Storage) {
  this.Storage = Storage;
  this.storageWrapper = null;
  this.data = {};
}

DictionaryStorage.prototype._initStorageWrapper = function _initStorageWrapper() {
  return new Promise((resolve, reject) => {
    this.storageWrapper = new AsyncStorageWrapper(this.Storage, (err, storageKeys) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(storageKeys);
    });
  });
};

DictionaryStorage.prototype.init = function init() {
  return this._initStorageWrapper().then((storageKeys) => {
    // save all storage keys to hashtable
    var keyPromises = Object.keys(storageKeys).map((key) => {
      return Storage.get(key).then((value) => {
        this.data[key] = value;
      });
    });

    return Promise.all(keyPromises);
  });
};
  
DictionaryStorage.prototype.setItem = function setItem(key, value) {
  this.data[key] = value;
  taskQueue.enqueueWork(this.storageWrapper.setItem.bind(this.storageWrapper, key, value)); // add task to queue
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
  taskQueue.enqueueWork(this.storageWrapper.removeItem.bind(this.storageWrapper, key)); // add task to queue
};

