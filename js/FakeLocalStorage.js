'use strict';

var WorkQueue = require('./WorkQueue.js')
  , taskQueue = new WorkQueue();

/**
 * Fake localstorage that is synchronous using chrome storage
 */
var FakeLocalStorage = {
  data: {},
  isReady: false
};

var ChromeStorageWrapper = {};

ChromeStorageWrapper.get = function(key) {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get(key, function(value) {
      resolve(value[key]);
    });
  });
};

ChromeStorageWrapper.set = function(key, value) {
  return new Promise(function(resolve, reject) {
    var obj = {};
    obj[key] = value;
    chrome.storage.local.set(obj, function() {
      resolve();
    });
  });
};

ChromeStorageWrapper.remove = function(key) {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.remove(key, function() {
      resolve();
    });
  });
};

FakeLocalStorage.init = function() {
  return ChromeStorageWrapper.get('chrome-storage-keys').then(function(result) {
    if (typeof(result) === 'undefined' || result === null) {
      return ChromeStorageWrapper.set('chrome-storage-keys', {});
    } else {
      var keyPromises = Object.keys(result).map(function(key) {
        return ChromeStorageWrapper.get(key).then(function(value) {
          FakeLocalStorage.data[key] = value;
        });
      });

      return Promise.all(keyPromises);
    }
  }).catch(function(e) { throw e; });
};

/**
 * Sets the item in chrome storage and if item key is not in storage keys, it adds it to the storage keys
 * @param {string} key
 * @param {Object} value
 */
function addItem(key, value) {
  return ChromeStorageWrapper.set(key, value).then(function() {
    return ChromeStorageWrapper.get('chrome-storage-keys');
  }).then(function(result) {
    if (typeof(result) === 'undefined' || result === null){
      return ChromeStorageWrapper.set('chrome-storage-keys', {});
    } else {
      var storageKeys = result;
      // if key is not inside storage keys dictionary, then add it to the dictionary
      if (typeof(storageKeys[key]) === 'undefined' || storageKeys[key] !== true) {
        storageKeys[key] = true;
      }
      return ChromeStorageWrapper.set('chrome-storage-keys', storageKeys);
    }
  }).catch(function(e) { throw e; });
}

FakeLocalStorage.setItem = function(key, value) {
  if (chrome && chrome.storage) {
    FakeLocalStorage.data[key] = value;
    taskQueue.enqueueWork(addItem.bind(null, key, value)); // add task to queue
  } else {
    throw new Error('FakeLocalStorage needs chrome storage to work');
  }
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
  ChromeStorageWrapper.remove(key).then(function() {
    FakeLocalStorage.data[key] = null;
  });
};

FakeLocalStorage.isChromeExtension = true;

module.exports = FakeLocalStorage;
