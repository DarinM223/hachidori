var HummingbirdAnimeList = (function($, HBAccessToken) {
  if (HBAccessToken === null) {
    alert('Error loading access token script');
  }

  /**
   * @class Animelist
   * @param {string} username the username of the anime list
   */
  function Animelist(username) {
    this.username = username;
    this.access_token = null;
    this.anime_list = null;
    this.getList(); // asynchronously retrive anime list
  }
  
  /**
   * Retrieves the anime list data from hummingbird
   * @param {function(err)} callback called once finished getting the list
   */
  Animelist.prototype.getList = function getList(callback) {
    // TODO: send ajax call to hummingbird to load the list
    $.ajax({
    }).done(function(msg) {
      alert('Data saved: ' + msg);
    });
  };

  return AnimeList;
}) (jQuery, HummingbirdAccessToken);
