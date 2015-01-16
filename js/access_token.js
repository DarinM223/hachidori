var HummingbirdAccessToken = (function($) {
  function AccessToken() {
    this.access_token = null;
    this.username = null;
  }
  /**
   * @return {string} the access token for the user
   */
  AccessToken.prototype.getAccessToken = function getAccessToken() {
    if (typeof(Storage) !== 'undefined' && this.access_token === null && localStorage !== undefined) {
      this.access_token = localStorage.getItem('hummingbird_access_token');
    }
    return this.access_token;
  };

  /**
   * @return {string} the username for the user
   */
  AccessToken.prototype.getUsername = function getUsername() {
    if (typeof(Storage) !== 'undefined' && this.access_token === null && localStorage !== undefined) {
      this.username = localStorage.getItem('hummingbird_username');
    }
    return this.username;
  };

  /**
   * authenticates a user in hummingbird
   * @param {string} username the username for the anime list
   * @param {string} password the password for the username's anime list
   * @param {function(err)} callback called when finished authenticating
   * @return {function(err)}
   */
  AccessToken.prototype.authenticate = function authenticate(username, password, callback) {
    if (this.getAccessToken() === null) {
      $.ajax({
        type: 'POST',
        url: 'https://hummingbird.me/api/v1/users/authenticate',
        data: {
          username: username,
          password: password
        }, 
        success: function(data, textStatus, jqXHR) {
          // set access_token in localstorage and in a member
          if (typeof(Storage) !== 'undefined' && localStorage !== undefined) { 
            localStorage.setItem('hummingbird_access_token', data);
            localStorage.setItem('hummingbird_username', username);
          }
          this.access_token = data;
          this.username = username;
          return callback(null);
        }.bind(this), 
        statusCode: {
          401: function() {
            console.log('You entered the wrong username or password');
            return callback(new Error('You entered the wrong username or password'));
          }, 
          500: function() {
            console.log('Internal server error');
            return callback(new Error('Internal server error'));
          }
        }
      });
    } else {
      return callback(null);
    }
  };

  /**
   * Removes the access token from localstorage and sets the access_token member to null
   */
  AccessToken.prototype.removeAccessToken = function removeAccessToken() {
    this.access_token = null;
    if (typeof(Storage) !== 'undefined' && localStorage !== undefined) { 
      localStorage.removeItem('hummingbird_access_token');
      localStorage.removeItem('hummingbird_username');
    }
  };
  return AccessToken;
}) (jQuery);

var GLOBAL_ACCESS_TOKEN = new HummingbirdAccessToken();
