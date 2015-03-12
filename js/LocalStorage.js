'use strict';
import FakeLocalStorage from './FakeLocalStorage.js';

/**
 * localstorage wrapper that works for both localstorage and chrome storage
 */
var LocalStorage = (function(localStorage, Storage, chrome) {
  if (typeof(Storage) !== 'undefined' && typeof(localStorage) !== 'undefined') {
    localStorage.isChromeExtension = false;
    return localStorage;
  } else if (chrome && chrome.storage) {
    return FakeLocalStorage;
  } else {
    throw new Error('localStorage is not defined');
  }
})(localStorage, Storage, chrome);

export default LocalStorage;
