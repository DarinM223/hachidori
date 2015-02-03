import $ from 'jquery';

export default class HummingbirdAccessToken {
  constructor() {
    this.access_token = null;
    this.username = null;
  }
  /**
   * @return {string} the access token for the user
   */
  getAccessToken() {
    if (typeof(Storage) !== 'undefined' && this.access_token === null && localStorage !== undefined) {
      this.access_token = localStorage.getItem('hummingbird_access_token');
    }
    return this.access_token;
  }

  /**
   * @return {string} the username for the user
   */
  getUsername() {
    if (typeof(Storage) !== 'undefined' && this.access_token === null && localStorage !== undefined) {
      this.username = localStorage.getItem('hummingbird_username');
    }
    return this.username;
  }

  /**
   * authenticates a user in hummingbird
   * @param {string} username the username for the anime list
   * @param {string} password the password for the username's anime list
   */
  authenticate(username, password) {
    return new Promise((resolve, reject) => {
      if (this.getAccessToken() !== null) {
        resolve(null);
      } else {
        $.ajax({
          type: 'POST',
          url: 'https://hummingbird.me/api/v1/users/authenticate',
          data: {
            username: username,
            password: password
          },
          success: (data, textStatus, jqXHR) => {
            // set access_token in localstorage and in a member
            if (typeof(Storage) !== 'undefined' && localStorage !== undefined) { 
              localStorage.setItem('hummingbird_access_token', data);
              localStorage.setItem('hummingbird_username', username);
            }
            this.access_token = data;
            this.username = username;
            resolve();
          }, 
          statusCode: {
            401: () => reject(new Error('You entered the wrong username or password')), 
            500: () => reject(new Error('Internal server error'))
          }
        });
      }
    });
  }

  /**
   * Removes the access token from localstorage and sets the access_token member to null
   */
  removeAccessToken() {
    this.access_token = null;
    if (typeof(Storage) !== 'undefined' && localStorage !== undefined) { 
      localStorage.removeItem('hummingbird_access_token');
      localStorage.removeItem('hummingbird_username');
    }
  }
}
