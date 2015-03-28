'use strict';
import FakeLocalStorage from './storage/FakeLocalStorage.js';
import ChromeStorageWrapper from './storage/ChromeStorageWrapper.js';

/**
 * localstorage wrapper that works for both localstorage and chrome storage
 */
var LocalStorage = (function() {
  /*
   * Wrapper around localStorage
   */
  var RealLocalStorage = {
    init: function() {
      return Promise.resolve(null);
    },

    getItem: function(key) {
      return localStorage.getItem(key);
    },

    setItem: function(key, value) {
      return localStorage.setItem(key, value);
    },

    removeItem: function(key) {
      return localStorage.removeItem(key);
    },

    isChromeExtension: false
  };

  if (typeof(Storage) !== 'undefined' && typeof(localStorage) !== 'undefined') {
    return RealLocalStorage;
  } else if (typeof(chrome) !== 'undefined' && chrome && chrome.storage) {
    var ChromeStorage = FakeLocalStorage(ChromeStorageWrapper);
    ChromeStorage.isChromeExtension = true;
    return ChromeStorage;
  } else {
    throw new Error('localStorage is not defined');
  }
})();

export default LocalStorage;
