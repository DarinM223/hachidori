'use strict';

/*
 * Promise based wrapper for the chrome storage API
 */

exports = module.exports = {};

/**
 * Clears the cache if it exists
 * ChromeStorageWrapper doesn't use a cache so this does nothing
 */
exports.clearCache = function clearCache() {
  // Do nothing
};

/**
 * Retrieves a value from chrome storage
 * @param {string} key
 * @return {Promise(Object)} the value corresponding to the key
 */
exports.get = function get(key) {
  if (typeof(chrome) === 'undefined' || chrome === null || typeof(chrome.storage) === 'undefined' || chrome.storage === null) {
    throw new TypeError('Chrome storage is not defined');
  }

  return new Promise(function(resolve) {
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
exports.set = function set(key, value) {
  if (typeof(chrome) === 'undefined' || chrome === null || typeof(chrome.storage) === 'undefined' || chrome.storage === null) {
    throw new TypeError('Chrome storage is not defined');
  }

  return new Promise(function(resolve) {
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
exports.remove = function remove(key) {
  if (typeof(chrome) === 'undefined' || chrome === null || typeof(chrome.storage) === 'undefined' || chrome.storage === null) {
    throw new TypeError('Chrome storage is not defined');
  }

  return new Promise(function(resolve) {
    chrome.storage.local.remove(key, function() {
      resolve();
    });
  });
};

