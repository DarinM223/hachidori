'use strict';

/*
 * Wraps calls to an asynchronous storage API so that it can keep track of the list of keys set
 * Keeps a dictionary of keys and setting and removing keys will modify both the actual
 * key-value pair but also the dictionary
 *
 * Getting all items from this requires asynchronously retrieving every single key one by one. 
 * It is ok for chrome storage but with server storage you will make too many requests to retrieve one thing
 */

/*
 * Expose `AsyncStorageOneByOneStrategy`
 */
module.exports = AsyncStorageOneByOneStrategy;

/**
 * @param {Object} Storage a wrapper to an asynchronous storage API
 * @property {function(key: String): Object} Storage.get
 * @property {function(key: String, value: Object)} Storage.set
 * @property {function(key: String)} Storage.remove
 * @param {function(Error, Array)} callback called after finished setting up AsyncStorageOneByOneStrategy
 * with an array of storage keys
 */
function AsyncStorageOneByOneStrategy(Storage) {
  if (typeof(Storage) === 'undefined' || Storage === null) {
    throw new TypeError('Storage is either not defined or null');
  }

  if (typeof(Storage.get) !== 'function' || 
      typeof(Storage.set) !== 'function' || 
      typeof(Storage.remove) !== 'function') {

    throw new TypeError('Storage is not property defined (it needs to have get, set, and remove functions)');
  }

  this.Storage = Storage;
}

AsyncStorageOneByOneStrategy.prototype._getStorageKeys = function _getStorageKeys() {
  return this.Storage.get('async-storage-keys').then(storageKeys => {
    if (typeof(storageKeys) === 'undefined' || storageKeys === null) {
      return this.Storage.set('async-storage-keys', {}).then(() => Promise.resolve({}));
    } else {
      return Promise.resolve(storageKeys);
    }
  });
};

/**
 * Returns the value corresponding to the key in chrome storage
 * @param {string} key
 * @return {Promise(Object)} value corresponding to the key
 */
AsyncStorageOneByOneStrategy.prototype.getItem = function getItem(key) {
  return this.Storage.get(key);
};


/**
 * Sets the item in chome storage and if item is not already in the list of keys, adds it to the list 
 * @paaram {string} key the key of the item to set
 * @param {Object} value the value of the key
 */
AsyncStorageOneByOneStrategy.prototype.setItem = function setItem(key, value) {
  return this.Storage.set(key, value)
    .then(() => this.Storage.get('async-storage-keys'))
    .then(storageKeys => {
      // if key is not inside storage keys dictionary, then add it to the dictionary
      if (typeof(storageKeys[key]) === 'undefined' || storageKeys[key] !== true) {
        storageKeys[key] = true;
        return this.Storage.set('async-storage-keys', storageKeys);
      } else {
        return Promise.resolve();
      }
    });
};

/**
 * Removes the item in chrome storage and if item is in the list of keys it removes from the list
 * @param {string} key the key of the object to remove
 */
AsyncStorageOneByOneStrategy.prototype.removeItem = function removeItem(key) {
  return this.Storage.remove(key)
    .then(() => this.Storage.get('async-storage-keys'))
    .then(storageKeys => {
      // if key is inside storage keys dictionary, then set the key to null
      if (typeof(storageKeys[key]) !== 'undefined' && storageKeys[key] !== null) {
        storageKeys[key] = null;
        return this.Storage.set('async-storage-keys', storageKeys);
      } else {
        return Promise.resolve();
      }
    });
};

/**
 * Set all items to local storage
 * @param {function} set called by Storage to set key-value pair locally
 */
AsyncStorageOneByOneStrategy.prototype.init = function init(set) {
  return this._getStorageKeys()
    .then(storageKeys => {
      // save all storage keys to hashtable
      var keyPromises = Object.keys(storageKeys).map(key => {
        return this.Storage.get(key).then((value) => {
          set(key, value);
        });
      });
      
      return Promise.all(keyPromises);
    });
};

