var HummingbirdAccessToken = (function($) {
  function AccessToken() {
    this.access_token = null;
  }
  /**
   * @return {string} the access token for the user
   */
  AccessToken.getAccessToken = function getAccessToken() {
    if (typeof(Storage) !== "undefined" && this.access_token === null) {
      this.access_token = localStorage.getItem('access_token');
    }
    return this.access_token;
  };

  /**
   * authenticates a user in hummingbird
   * @param {string} password the password for the username's anime list
   * @param {function(err)} callback called when finished authenticating
   * @return {function(err)}
   */
  AccessToken.prototype.authenticate = function authenticate(username, password, callback) {
    if (this.getAccessToken() === null) {
      // TODO: authenticate user and set access_token property
      $.ajax({
      }).done(function(msg) {
      });
    } else {
      callback(null);
    }
  };
}) (jQuery);
