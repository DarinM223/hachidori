'use strict';

/*
 * Promise based wrapper for the chrome storage API
 */

var ChromeStorageWrapper = {};

/**
 * Retrieves a value from chrome storage
 * @param {string} key
 * @return {Promise(Object)} the value corresponding to the key
 */
ChromeStorageWrapper.get = function(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, function(value) {
      resolve(value[key]);
    });
  });
};

/**
 * Sets a key-value pair in chrome storage
 * @param {string} key
 * @param {Object} value
 */
ChromeStorageWrapper.set = function(key, value) {
  return new Promise((resolve, reject) => {
    var obj = {};
    obj[key] = value;
    chrome.storage.local.set(obj, function() {
      resolve();
    });
  });
};

/**
 * Removes a key-value pair in chrome storage
 * @param {string} key
 */
ChromeStorageWrapper.remove = function(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(key, function() {
      resolve();
    });
  });
};

export default ChromeStorageWrapper;
