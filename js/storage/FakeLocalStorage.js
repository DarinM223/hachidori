'use strict';

/*
 * Synchronous localStorage that wraps asynchronous storage apis
 */

import WorkQueue from '../WorkQueue.js';
import AsyncStorageWrapper from './AsyncStorageWrapper.js';

var taskQueue = new WorkQueue();

/**
 * @param {Object} Storage a wrapper to an asynchronous storage API
 * @property {function(key: String): Object} Storage.get
 * @property {function(key: String, value: Object)} Storage.set
 * @property {function(key: String)} Storage.remove
 */
var FakeLocalStorage = function(Storage) {
  if (typeof(chrome) === 'undefined' || chrome === null || typeof(chrome.storage) === 'undefined' || chrome.storage === null) {
    throw new TypeError('Chrome storage is not defined');
  }

  var storageWrapper = null;

  var FakeLocalStorage = {
    data: {},
    isReady: false
  }; 

  FakeLocalStorage._initStorageWrapper = function() {
    return new Promise((resolve, reject) => {
      storageWrapper = new AsyncStorageWrapper(Storage, function(err, storageKeys) {
        if (err) reject(err);
        resolve(storageKeys);
      });
    });
  };

  FakeLocalStorage.init = function() {
    return FakeLocalStorage._initStorageWrapper().then(function(storageKeys) {
      // save all storage keys to hashtable
      var keyPromises = Object.keys(storageKeys).map(function(key) {
        return Storage.get(key).then(function(value) {
          FakeLocalStorage.data[key] = value;
        });
      });

      return Promise.all(keyPromises);
    }).catch(function(e) {
      console.log(e);
    });
  };
  
  FakeLocalStorage.setItem = function(key, value) {
    FakeLocalStorage.data[key] = value;
    taskQueue.enqueueWork(storageWrapper.setItem.bind(storageWrapper, key, value)); // add task to queue
  };

  FakeLocalStorage.getItem = function(key) {
    if (typeof(FakeLocalStorage.data[key]) === 'undefined') {
      FakeLocalStorage.data[key] = null;
      return null;
    } else {
      return FakeLocalStorage.data[key];
    }
  };

  FakeLocalStorage.removeItem = function(key) {
    FakeLocalStorage.data[key] = null;
    taskQueue.enqueueWork(storageWrapper.removeItem.bind(storageWrapper, key)); // add task to queue
  };

  return FakeLocalStorage;
};

export default FakeLocalStorage;
