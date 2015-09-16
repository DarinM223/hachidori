'use strict';

/*
 * Synchronous storage using a `dictionary` that wraps asynchronous storage apis
 */

var WorkQueue = require('../WorkQueue.js')
  , AsyncStorageWrapper = require('./AsyncStorageWrapper.js');

// TODO(darin): replace with singleton
var taskQueue = new WorkQueue();

/**
 * @param {Object} Storage a wrapper to an asynchronous storage API
 * @property {function(key: String): Object} Storage.get
 * @property {function(key: String, value: Object)} Storage.set
 * @property {function(key: String)} Storage.remove
 */
var DictionaryStorage = function(Storage) {
  var storageWrapper = null;

  var DictionaryStorage = {
    data: {},
    isReady: false
  }; 

  DictionaryStorage._initStorageWrapper = function() {
    return new Promise((resolve, reject) => {
      storageWrapper = new AsyncStorageWrapper(Storage, function(err, storageKeys) {
        if (err) {
          reject(err);
          return;
        }
        resolve(storageKeys);
      });
    });
  };

  DictionaryStorage.init = function() {
    return DictionaryStorage._initStorageWrapper().then(function(storageKeys) {
      // save all storage keys to hashtable
      var keyPromises = Object.keys(storageKeys).map(function(key) {
        return Storage.get(key).then(function(value) {
          DictionaryStorage.data[key] = value;
        });
      });

      return Promise.all(keyPromises);
    }).catch(function(e) {
      console.log(e);
    });
  };
  
  DictionaryStorage.setItem = function(key, value) {
    DictionaryStorage.data[key] = value;
    taskQueue.enqueueWork(storageWrapper.setItem.bind(storageWrapper, key, value)); // add task to queue
  };

  DictionaryStorage.getItem = function(key) {
    if (typeof(DictionaryStorage.data[key]) === 'undefined') {
      DictionaryStorage.data[key] = null;
      return null;
    } else {
      return DictionaryStorage.data[key];
    }
  };

  DictionaryStorage.removeItem = function(key) {
    DictionaryStorage.data[key] = null;
    taskQueue.enqueueWork(storageWrapper.removeItem.bind(storageWrapper, key)); // add task to queue
  };

  return DictionaryStorage;
};

module.exports = DictionaryStorage;
