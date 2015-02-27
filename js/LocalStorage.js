'use strict';

/**
 * localstorage wrapper that works for both localstorage and chrome storage
 */
var LocalStorage = (function(localStorage, Storage, chrome) {
  /**
   * Fake localstorage that is synchronous using chrome storage
   */
  var FakeLocalStorage = {
    data: {},
    isReady: false
  };

  var ChromeStorageWrapper = {};

  ChromeStorageWrapper.get = function(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, function(value) {
        resolve(value);
      });
    });
  };

  ChromeStorageWrapper.set = function(key, value) {
    return new Promise((resolve, reject) => {
      var obj = {};
      obj[key] = value;
      chrome.storage.local.set(obj, function() {
        resolve();
      });
    });
  };

  ChromeStorageWrapper.remove = function(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove(key, function() {
        resolve();
      });
    });
  };

  FakeLocalStorage.init = function() {
    return ChromeStorageWrapper.get('chrome-storage-keys').then(function(result) {
      if (typeof(result) === 'undefined' || result === null || Object.keys(result).length === 0) {
        return ChromeStorageWrapper.set('chrome-storage-keys', []);
      } else {
        var keyPromises = result['chrome-storage-keys'].map(function(key) {
          return ChromeStorageWrapper.get(key).then(function(value) {
            FakeLocalStorage.data[key] = value;
          });
        });

        return Promise.all(keyPromises);
      }
    }).catch((e) => { throw e; });
  };

  FakeLocalStorage.setItem = function(key, value) {
    console.log('Setting key: ' + key + ' to value: ' + value);
    if (chrome && chrome.storage) {
      FakeLocalStorage.data[key] = value;
      ChromeStorageWrapper.set(key, value).then(function() {
        return ChromeStorageWrapper.get('chrome-storage-keys');
      }).then(function(result) {
        console.log(result);
        if (typeof(result) === 'undefined' || result === null || Object.keys(result).length === 0){
          return ChromeStorageWrapper.set('chrome-storage-keys', []);
        } else {
          var keys = result['chrome-storage-keys'];
          console.log(keys);
          keys.push(key);
          return ChromeStorageWrapper.set('chrome-storage-keys', keys);
        }
      }).catch((e) => { throw e; });
    } else {
      throw new Error('FakeLocalStorage needs chrome storage to work');
    }
  };

  FakeLocalStorage.getItem = function(key) {
    console.log('Getting key: ' + key);
    if (typeof(FakeLocalStorage.data[key]) === 'undefined') {
      FakeLocalStorage.data[key] = null;
      return null;
    } else {
      return FakeLocalStorage.data[key];
    }
  };

  FakeLocalStorage.removeItem = function(key) {
    console.log('Removing key: ' + key);
    ChromeStorageWrapper.remove(key).then(function() {
      FakeLocalStorage.data[key] = null;
    });
  };

  if (typeof(Storage) !== 'undefined' && typeof(localStorage) !== 'undefined') {
    localStorage.init = function() {
      return Promise.resolve();
    };
    return localStorage;
  } else if (chrome && chrome.storage) {
    return FakeLocalStorage;
  } else {
    throw new Error('localStorage is not defined');
  }
})(localStorage, Storage, chrome);

export default LocalStorage;
