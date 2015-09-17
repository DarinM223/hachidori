'use strict';

/*
 * Promise based wrapper for the hachidori node.js backend
 */

var request = require('superagent');

/*
 * Expose the ServerStorageWrapper function
 */
module.exports = ServerStorageWrapper;

/**
 * A function that takes in a username and 
 * returns a new `ServerStorage`
 */
function ServerStorageWrapper(username) {
  return new ServerStorage(username);
}

/**
 * A storage wrapper for the node.js backend server
 * @param {string} username Hummingbird username
 */
function ServerStorage(username) {
  this.username = username;
  this._locationURL = window.location.origin + '/storage/' + this.username;
}

/**
 * Retrieves a value from the key
 * @param {string} key
 * @return {Promise(Object)} key's value
 */
ServerStorage.prototype.get = function get(key) {
  return new Promise((resolve, reject) => {
    request
      .get(this._locationURL)
      .query({ key: key })
      .end((e, res) => {
        if (e) {
          reject(e);
          return;
        }

        resolve(res.body);
      });
  });
};

/**
 * Sets a key-value pair
 * @param {string} key
 * @param {Object} value
 */
ServerStorage.prototype.set = function set(key, value) {
  request
    .post(this._locationURL)
    .send({ key: key, value: value })
    .end();
};

/**
 * Removes a key-value pair 
 * @param {string} key
 */
ServerStorage.prototype.remove = function remove(key) {
  request
    .del(this._locationURL + `/${ key }`)
    .end();
};

