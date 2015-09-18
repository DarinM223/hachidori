'use strict';

/*
 * Promise based wrapper for the hachidori node.js backend
 */

var request = require('request-promise')
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
}

/**
 * Retrieves the user's data
 * @param {string} key
 * @return {Promise(Object)} key's value
 */
ServerStorage.prototype.get = function get() {
  return request(this._locationURL);
};

/**
 * Sets a user's data
 * @param {Object} data the data to set for the username
 */
ServerStorage.prototype.set = function set(data) {
  return request({
    method: 'POST',
    uri: this._locationURL,
    form: { userData: JSONEncoder.encodeJSON(data) }
  });
};

/**
 * Removes the data for a user
 * @param {string} key
 */
ServerStorage.prototype.remove = function remove() {
  return request({
    method: 'DELETE',
    uri: this._locationURL
  });
};

