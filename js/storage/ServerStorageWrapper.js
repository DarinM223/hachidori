'use strict';

/*
 * Promise based wrapper for the hachidori node.js backend
 */

var request = require('superagent')
  , JSONEncoder = require('../../JSONEncoder.js');

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
  this.cachedData = null;
}

/**
 * Retrieves the user's data
 * @param {string} key
 * @return {Promise(Object)} key's value
 */
ServerStorage.prototype.get = function get(key) {
  var getDataPromise = new Promise((resolve, reject) => {
    if (this.cachedData === null) {
      request
        .get(this._locationURL)
        .end((e, res) => {
          if (e) {
            reject(e);
            return;
          }

          this.cachedData = JSONEncoder.decodeJSON(res.text);
          resolve(null);
        });
    } else {
      resolve(null);
    }
  });
  return getDataPromise.then(() => {
    return Promise.resolve(this.cachedData[key]);
  });
};

/**
 * Sets a key in the user's data
 * @param {Object} data the data to set for the username
 */
ServerStorage.prototype.set = function set(key, value) {
  return new Promise((resolve, reject) => {
    request
      .post(this._locationURL + '/' + encodeURIComponent(key))
      .send({ key: key, value: JSONEncoder.encodeJSON(value) })
      .end((e, res) => {
        if (e) {
          reject(e);
          return;
        }

        this.cachedData[key] = value;
        resolve(res.text);
      });
  });
};

/**
 * Removes a key in the user's data
 * @param {string} key
 */
ServerStorage.prototype.remove = function remove(key) {
  return new Promise((resolve, reject) => {
    request
      .delete(this._locationURL + '/' + encodeURIComponent(key))
      .end((e, res) => {
        if (e) {
          reject(e);
          return;
        }

        resolve(res.text);
      });
  });
};

