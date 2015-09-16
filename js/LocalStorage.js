'use strict';

/**
 * localstorage wrapper that works for both localstorage and chrome storage
 */

var DictionaryStorage = require('./storage/DictionaryStorage.js')
  , BrowserLocalStorage = require('./storage/BrowserLocalStorage.js')
  , ChromeStorageWrapper = require('./storage/ChromeStorageWrapper.js');

/*
 * Expose `LocalStorage`
 */

var LocalStorage = module.exports = (function() {
  if (typeof(Storage) !== 'undefined' && typeof(localStorage) !== 'undefined') {
    var browserStorage = BrowserLocalStorage(null);
    browserStorage.isChromeExtension = false;
    return browserStorage;
  } else if (typeof(chrome) !== 'undefined' && chrome && chrome.storage) {
    var chromeStorage = DictionaryStorage(ChromeStorageWrapper);
    chromeStorage.isChromeExtension = true;
    return chromeStorage;
  } else {
    throw new Error('localStorage is not defined');
  }
})();

