'use strict';

/**
 * localstorage wrapper that works for both localstorage and chrome storage
 */

var DictionaryStorage = require('./storage/DictionaryStorage.js')
  , BrowserLocalStorage = require('./storage/BrowserLocalStorage.js')
  , ChromeStorageWrapper = require('./storage/ChromeStorageWrapper.js');

/*
 * Expose a function that returns the local storage best suited for the current environment
 * (if you are in a browser, it will return a wrapper for the normal localStorage, 
 * if you are in a chrome extension, it will return a wrapper for chrome local storage)
 */
module.exports = (function() {
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

