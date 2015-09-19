'use strict';

var DictionaryStorage = require('./storage/DictionaryStorage.js')
  , BrowserLocalStorage = require('./storage/BrowserLocalStorage.js')
  , ServerStorageWrapper = require('./storage/ServerStorageWrapper.js')
  , AsyncStorageOneByOneStrategy = require('./storage/AsyncStorageOneByOneStrategy.js')
  , HummingbirdAccessToken = require('./HummingbirdAccessToken.js');

module.exports = (function() {
  var accessToken = new HummingbirdAccessToken();
  if (typeof(Storage) !== 'undefined' && typeof(localStorage) !== 'undefined') {
    // Use browser localStorage 
    var browserStorage = BrowserLocalStorage(ServerStorageWrapper(accessToken.getUsername()), AsyncStorageOneByOneStrategy);
    browserStorage.isChromeExtension = false;
    return browserStorage;
  } else if (typeof(chrome) !== 'undefined' && chrome && chrome.storage) {
    // Create a chrome storage wrapper that uses asynchronous one-by-one item fetching
    var chromeStorage = DictionaryStorage(ServerStorageWrapper(accessToken.getUsername()), AsyncStorageOneByOneStrategy);
    chromeStorage.isChromeExtension = true;
    return chromeStorage;
  } else {
    throw new Error('localStorage is not defined');
  }
})();

