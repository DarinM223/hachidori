var HummingbirdAnimeList = (function($, _) {
  if (HummingbirdAccessToken === null || _ === null) {
    alert('Error loading script');
  }

  /**
   * @class Animelist
   * @param {string} username the username of the anime list
   */
  function Animelist(username) {
    this.username = username;
    this.access_token = null;
    this.anime_list = null;
    this.getList(function() {}); // asynchronously retrive anime list
  }
  
  /**
   * Retrieves the anime list data from hummingbird
   * @param {function(err)} callback called once finished getting the list
   */
  Animelist.prototype.getList = function getList(callback) {
    var _callback = callback;
    $.ajax({
      type: 'GET',
      url: 'http://hummingbird.me/api/v1/users/' + this.username + '/library',
      success: function(data, textStatus, jqXHR) {
        this.anime_list = data;
        if (typeof(Storage) !== 'undefined') { // save anime list into local storage
          localStorage.setItem(this.username, JSON.stringify(this.anime_list)); // TODO: call this in webworker
        }
        _callback(null);
      }.bind(this),
      error: function(jqXHR, textStatus, error) {
        if (typeof(Storage) !== 'undefined') { // load anime list from local storage
          this.anime_list = JSON.parse(localStorage.getItem(this.username)); // TODO: call this in webworker
        }
        _callback(error);
      }.bind(this)
    });
  };

  Animelist.prototype.getCurrentlyWatching = function getCurrentlyWatching() {
    return _.where(this.anime_list, { status: 'currently-watching' });
  };

  Animelist.prototype.getCompleted = function getCompleted() {
    return _.where(this.anime_list, { status: 'completed' });
  };

  Animelist.prototype.getPlanToWatch = function getPlanToWatch() {
    return _.where(this.anime_list, { status: 'plan-to-watch' });
  };

  Animelist.prototype.getOnHold = function getOnHold() {
    return _.where(this.anime_list, { status: 'on-hold' });
  };

  Animelist.prototype.getDropped = function getDropped() {
    return _.where(this.anime_list, { status: 'dropped' });
  };

  return Animelist;
}) (jQuery, _.noConflict());
