'use strict';

var WorkQueue = require('../WorkQueue.js');

/*
 * Expose `StorageMethods`
 */
module.exports = StorageMethods;

function StorageMethods(Storage, StorageWrapper) {
  this.Storage = Storage;
  if (Storage !== null) {
    this.storageWrapper = new StorageWrapper(Storage);
  } else {
    this.storageWrapper = null;
  }
  this.taskQueue = new WorkQueue();
}

/**
 * Initialize the storage wrapper
 * If the Storage property is null, don't do anything (no syncing with external api)
 * otherwise, get the keys already in the asynchronous store and set them in storage
 * @param {function(key, value)} set a function to set a pair locally
 */
StorageMethods.prototype.init = function init(set) {
  if (this.Storage === null) {
    return Promise.resolve(null);
  }
  return this.storageWrapper.init(set);
};

/**
 * Enqueues work to set item in the asynchronous store if it exists
 * @param {string} key
 * @param {Object} value
 */
StorageMethods.prototype.setItem = function setItem(key, value) {
  if (this.storageWrapper !== null) {
    this.taskQueue.enqueueWork(this.storageWrapper.setItem.bind(this.storageWrapper, key, value)); // add task to queue
  }
};

/**
 * Enqueues work to remove item in the asynchronous store if it exists
 * @param {string} key
 */
StorageMethods.prototype.removeItem = function removeItem(key) {
  if (this.storageWrapper !== null) {
    this.taskQueue.enqueueWork(this.storageWrapper.removeItem.bind(this.storageWrapper, key)); // add task to queue
  }
};

