'use strict'; 

var request = require('superagent')
  , LocalStorage = require('./LocalStorage.js');

/**
 * An access token for a Hummingbird account
 * @constructor
 */
function HummingbirdAccessToken() {
  this.access_token = null;
  this.username = null;
}

/**
 * @return {string} the access token for the user
 */
HummingbirdAccessToken.prototype.getAccessToken = function() {
  if (this.access_token === null) {
    this.access_token = LocalStorage.getItem('hummingbird_access_token');
  }
  return this.access_token;
};

/**
 * @return {string} the username for the user
 */
HummingbirdAccessToken.prototype.getUsername = function() {
  if (this.username === null) {
    this.username = LocalStorage.getItem('hummingbird_username');
  }
  return this.username;
};

/**
 * authenticates a user in hummingbird
 * @param {string} username the username for the anime list
 * @param {string} password the password for the username's anime list
 * @return {Promise}
 */
HummingbirdAccessToken.prototype.authenticate = function(username, password) {
  var that = this;

  return new Promise(function(resolve, reject) {

    if (that.getAccessToken() !== null) {
      resolve(null);
    } else {
      request.post('https://hummingbird.me/api/v1/users/authenticate')
        .send({ username: username, password: password }).end(function(e, res) {

        if (e) {
          switch (e.status) {
            case 401:
              reject(new Error('You entered the wrong username or password'));
              break;
            case 500: 
              reject(new Error('Internal server error'));
              break;
            default:
              reject(new Error('There was an error with error code: ' + e.status));
              break;
          }
        } else {
          // set access_token in localstorage and in a member
          LocalStorage.setItem('hummingbird_access_token', res.body);
          LocalStorage.setItem('hummingbird_username', username);

          that.access_token = res.body;
          that.username = username;
          resolve();
        }
      });
    }
  });
};

HummingbirdAccessToken.prototype.removeAccessToken = function() {
  this.access_token = null;
  LocalStorage.removeItem('hummingbird_access_token');
  LocalStorage.removeItem('hummingbird_username');
};

module.exports = HummingbirdAccessToken;
