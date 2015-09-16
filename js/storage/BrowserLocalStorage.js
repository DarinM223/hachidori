'use strict';

/*
 * Synchronous localstorage that can also sync with asynchronous apis
 */

var WorkQueue = require('../WorkQueue.js')
  , AsyncStorageWrapper = require('./AsyncStorageWrapper.js');

/*
 * Expose a function that takes a Storage parameter and returns 
 * a new `BrowserLocalStorage`
 */

module.exports = function(Storage) {
  if (typeof localStorage === 'undefined' || localStorage === null) {
    throw new Error('Browser\'s local storage is not defined!'); 
  }
  return new BrowserLocalStorage(Storage);
};

// TODO(darin): replace with singleton
var taskQueue = new WorkQueue();

/**
 * @constructor
 */

function BrowserLocalStorage(Storage) {
  this.Storage = Storage;
  this.storageWrapper = null;
}

/**
 * Initialize the storage wrapper
 * If the Storage property is null, don't do anything (no syncing with external api)
 * otherwise, resolve with a list of the current keys in the asynchronous store
 */

BrowserLocalStorage.prototype._initStorageWrapper = function _initStorageWrapper() {
  if (this.Storage === null) {
    return Promise.resolve(null);
  }
  return new Promise((resolve, reject) => {
    this.storageWrapper = new AsyncStorageWrapper(Storage, (err, storageKeys) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(storageKeys);
    });
  });
};

BrowserLocalStorage.prototype.init = function init() {
  if (this.Storage === null) {
    return Promise.resolve(null);
  }
  return this._initStorageWrapper().then(function(storageKeys) {
    // save all storage keys to hashtable
    var keyPromises = Object.keys(storageKeys).map((key) => {
      return Storage.get(key).then((value) => {
        localStorage.setItem(key, value);
      });
    });

    return Promise.all(keyPromises);
  });
};

BrowserLocalStorage.prototype.setItem = function setItem(key, value) {
  localStorage.setItem(key, value);
  if (this.storageWrapper !== null) {
    taskQueue.enqueueWork(this.storageWrapper.setItem.bind(this.storageWrapper, key, value)); // add task to queue
  }
};

BrowserLocalStorage.prototype.getItem = function getItem(key) {
  return localStorage.getItem(key);
};

BrowserLocalStorage.prototype.removeItem = function removeItem(key) {
  localStorage.removeItem(key);
  if (this.storageWrapper !== null) {
    taskQueue.enqueueWork(this.storageWrapper.removeItem.bind(this.storageWrapper, key)); // add task to queue
  }
};

