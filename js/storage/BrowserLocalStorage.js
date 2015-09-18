'use strict';

/*
 * Synchronous localStorage that can also sync with asynchronous apis
 */

var StorageMethods = require('./StorageMethods.js');

/*
 * Expose a function that takes a Storage parameter and returns 
 * a new `BrowserLocalStorage`
 */
module.exports = function(Storage, StorageWrapper) {
  if (typeof localStorage === 'undefined' || localStorage === null) {
    throw new Error('Browser\'s local storage is not defined!'); 
  }
  return new BrowserLocalStorage(Storage, StorageWrapper);
};

/**
 * A wrapper to an asynchronous storage API 
 * using the browser's localStorage to store values
 * @property {function(key: String): Object} Storage.get
 * @property {function(key: String, value: Object)} Storage.set
 * @property {function(key: String)} Storage.remove
 * @constructor
 */
function BrowserLocalStorage(Storage, StorageWrapper) {
  this.storageMethods = new StorageMethods(Storage, StorageWrapper);
}

BrowserLocalStorage.prototype.init = function init() {
  return this.storageMethods.init((key, value) => localStorage.setItem(key, value));
};

BrowserLocalStorage.prototype.setItem = function setItem(key, value) {
  localStorage.setItem(key, value);
  this.storageMethods.setItem(key, value);
};

BrowserLocalStorage.prototype.getItem = function getItem(key) {
  return localStorage.getItem(key);
};

BrowserLocalStorage.prototype.removeItem = function removeItem(key) {
  localStorage.removeItem(key);
  this.storageMethods.removeItem(key);
};

