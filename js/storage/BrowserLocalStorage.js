'use strict';

/*
 * Synchronous localStorage that can also sync with asynchronous apis
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
 * A wrapper to an asynchronous storage API 
 * using the browser's localStorage to store values
 * @property {function(key: String): Object} Storage.get
 * @property {function(key: String, value: Object)} Storage.set
 * @property {function(key: String)} Storage.remove
 * @constructor
 */
function BrowserLocalStorage(Storage) {
  this.Storage = Storage;
  this.storageWrapper = null;
}

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

/**
 * Initialize the storage wrapper
 * If the Storage property is null, don't do anything (no syncing with external api)
 * otherwise, get the keys already in the asynchronous store and set them in localStorage
 */
BrowserLocalStorage.prototype.init = function init() {
  if (this.Storage === null) {
    return Promise.resolve(null);
  }
  return this._initStorageWrapper().then((storageKeys) => {
    // save all storage keys to hashtable
    var keyPromises = Object.keys(storageKeys).map((key) => {
      return Storage.get(key).then((value) => {
        localStorage.setItem(key, value);
      });
    });

    return Promise.all(keyPromises);
  });
};

/**
 * Sets an item in localStorage and enqueues work to set
 * it in the asynchronous store if it exists
 * @param {string} key
 * @param {Object} value
 */
BrowserLocalStorage.prototype.setItem = function setItem(key, value) {
  localStorage.setItem(key, value);
  if (this.storageWrapper !== null) {
    taskQueue.enqueueWork(this.storageWrapper.setItem.bind(this.storageWrapper, key, value)); // add task to queue
  }
};

/**
 * Retrieves an item in localStorage
 * @param {string} key
 * @returns {Object} the value for the key
 */
BrowserLocalStorage.prototype.getItem = function getItem(key) {
  return localStorage.getItem(key);
};

/**
 * Removes an item in localStorage and enqueues work to remove 
 * it in the asynchronous store if it exists
 * @param {string} key
 */
BrowserLocalStorage.prototype.removeItem = function removeItem(key) {
  localStorage.removeItem(key);
  if (this.storageWrapper !== null) {
    taskQueue.enqueueWork(this.storageWrapper.removeItem.bind(this.storageWrapper, key)); // add task to queue
  }
};

