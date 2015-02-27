'use strict';

/**
 * localstorage wrapper that works for both localstorage and chrome storage
 */
var LocalStorage = (function(localStorage, Storage, chrome) {
  if (typeof(Storage) !== 'undefined' && typeof(localStorage) !== 'undefined') {
    return localStorage;
  } else if (chrome && chrome.app && chrome.app.runtime && chrome.storage) {
    return FakeLocalStorage;
  } else {
    throw new Error('localStorage is not defined');
  }

  /**
   * Fake localstorage that is synchronous using chrome storage
   */
  var FakeLocalStorage = {
    data: {}
  };

  FakeLocalStorage.setItem = function(key, value) {
    if (typeof(key) !== 'string' || typeof(value) !== 'string') {
      throw new TypeError('Parameters of setItem have to be strings');
    }

    if (chrome && chrome.storage) {
      chrome.storage.sync.set({ key: value }, function() {
        FakeLocalStorage.data[key] = value;
      });
    } else {
      throw new Error('FakeLocalStorage needs chrome storage to work');
    }
  };

  FakeLocalStorage.getItem = function(key) {
    if (typeof(key) !== 'string') {
      throw new TypeError('Parameters of getItem has to be strings');
    }

    return FakeLocalStorage.data[key];
  };

  FakeLocalStorage.removeItem = function(key) {
    if (typeof(key) !== 'string') {
      throw new TypeError('Parameters of removeItem has to be a string');
    }

    chrome.storage.sync.remove(key, function() {
      FakeLocalStorage.data[key] = null;
    });
  };

  if (chrome && chrome.storage) {
    // on the event that an item changed set the localstorage to the changed value
    chrome.storage.onChanged.addListener(function(changes) {
      for (key in changes) {
        var storageChange = changes[key];
        FakeLocalStorage.data[key] = storageChange.newValue;
        console.log('Data in key: ' + key + ' was changed to value: ' + FakeLocalStorage.data[key]);
      }
    });
  }
})(localStorage, Storage, chrome);

export default LocalStorage;
