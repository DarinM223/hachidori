'use strict';
import FakeLocalStorage from './FakeLocalStorage.js';

/**
 * localstorage wrapper that works for both localstorage and chrome storage
 */
var LocalStorage = (function(localStorage, Storage, chrome) {
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
  } else if (chrome && chrome.storage) {
    return FakeLocalStorage;
  } else {
    throw new Error('localStorage is not defined');
  }
})(localStorage, Storage, chrome);

export default LocalStorage;
