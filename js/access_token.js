var HummingbirdAccessToken = (function($) {
  function AccessToken() {
    this.access_token = null;
  }
  /**
   * @return {string} the access token for the user
   */
  AccessToken.prototype.getAccessToken = function getAccessToken() {
    if (typeof(Storage) !== 'undefined' && this.access_token === null) {
      this.access_token = localStorage.getItem('access_token');
    }
    return this.access_token;
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
        url: 'http://hummingbird.me/api/v1/users/authenticate',
        data: {
          username: username,
          password: password
        }, 
        success: function(data, textStatus, jqXHR) {
          // set access_token in localstorage and in a member
          if (typeof(Storage) !== 'undefined') { 
            localStorage.setItem('access_token', data);
          }
          this.access_token = data;
          return callback(null);
        }.bind(this), 
        error: function(jqXHR, textStatus, error) {
          return callback(error);
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
    // TODO: remove from localstorage
    if (typeof(Storage) !== 'undefined') { 
      localStorage.removeItem('access_token');
    }
  };
  return AccessToken;
}) (jQuery);

var GLOBAL_ACCESS_TOKEN = new HummingbirdAccessToken();
