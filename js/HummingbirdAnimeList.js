import HummingbirdAccessToken from './HummingbirdAccessToken.js';
import $ from 'jquery';
import _ from 'underscore';

/**
 * Hummingbird animelist for a user
 * @param {string} username the username of the anime list
 * @constructor
 */
function HummingbirdAnimeList(username, success, error) {
  this.username = username;
  this.access_token = null;
  this.anime_list = null;
  this.favorite_anime = null;
  this.loadStuff().then(success, error);
}

HummingbirdAnimeList.prototype.loadStuff = async function() {
  try {
    await this._loadList();
    await this._loadFavoriteAnime();
    return null;
  } catch (e) {
    throw e;
  }
};

/**
 * Retrieves the anime list data from hummingbird
 * @return {Promise}
 */
HummingbirdAnimeList.prototype._loadList = function() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'GET',
      url: 'http://hummingbird.me/api/v1/users/' + this.username + '/library',
      success: (data, textStatus, jqXHR) => {
        this.anime_list = data;
        localStorage.setItem('animelist-cached:' + this.username, JSON.stringify(this.anime_list)); 
        resolve();
      },
      error: (jqXHR, textStatus, err) => {
        this.anime_list = JSON.parse(localStorage.getItem('animelist-cached:' + this.username)); 
        reject(err);
      }
    });
  });
};

/**
 * Retrieves the user's favorite anime from hummingbird
 * @return {Promise}
 */
HummingbirdAnimeList.prototype._loadFavoriteAnime = function() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'GET',
      url: 'http://hummingbird.me/api/v1/users/' + this.username + '/favorite_anime',
      success: (data, textStatus, jqXHR) => {
        this.favorite_anime = data;
        localStorage.setItem('anime-cached:' + this.username+':favorite', JSON.stringify(this.favorite_anime));
        resolve();
      },
      error: (jqXHR, textStatus, err) => {
        this.favorite_anime = JSON.parse(localStorage.getItem('anime-cached:' + this.username + ':favorite'));
        reject(err);
      }
    });
  });
};

/**
 * Gets the list for the current user
 * @return {Array.<LibraryItem>} user's anime list
 */
HummingbirdAnimeList.prototype.getList = function() {
  return this.anime_list;
};

/**
 * Removes the anime from the user's anime list
 * @param {string} animeid the id of the anime to remove
 * @return {Promise}
 */
HummingbirdAnimeList.prototype.removeFromList = function(animeid) {
  return new Promise((resolve, reject) => {
    let access_token = new HummingbirdAccessToken();

    if (access_token.getAccessToken() === null) {
      reject(new Error('You are not authorized to perform this action'));
    } else {
      $.ajax({
        type: 'POST', 
        url: 'https://hummingbird.me/api/v1/libraries/' + animeid + '/remove',
        data: {
          auth_token: access_token.getAccessToken()
        },
        success: () => resolve(),
        statusCode: {
          401: () => reject(new Error('You are not authorized to perform this action')),
          500: () => reject(new Error('There was an internal server error'))
        },
      });
    }
  });
};

/**
 * @param {string} animeid id of anime to update
 * @param {Object} updateparams parameters to update
 * @property {string?} updateparams.status updated status of the anime
 * @property {boolean?} updateparams.privacy updated privacy of the anime
 * @property {double?} updateparams.rating updated rating of the anime
 * @property {boolean?} updateparams.rewatching updated if watching or not
 * @property {integer?} updateparams.rewatched_times updated number of rewatched times
 * @property {string?} updateparams.notes updated notes
 * @property {integer?} updateparams.episodes_watched updated watched episodes
 * @property {boolean?} updateparams.increment_episodes if true, increment the episodes
 * @return {Promise(LibraryItem)} the updated library item
 */
HummingbirdAnimeList.update = function(animeid, updateparams) {
  return new Promise((resolve, reject) => {
    var access_token = new HummingbirdAccessToken();
    if (access_token.getAccessToken() === null) {
      reject(new Error('You are not authorized to perform this action'));
    } else {
      var params = _.pick(updateparams, 'status', 'privacy', 'rating', 'rewatching', 
                          'rewatched_times', 'notes', 'episodes_watched', 'increment_episodes', 'sane_rating_update');

      _.extend(params, { id: animeid, auth_token: access_token.getAccessToken() });

      $.ajax({
        type: 'POST',
        url: 'https://hummingbird.me/api/v1/libraries/' + animeid,
        data: params,
        success: (data, textStatus, jqXHR) => resolve(data),
        statusCode: {
          401: () => reject(new Error('You are not authorized to perform this action')),
          500: () => reject(new Error('There was an internal server error'))
        }
      });
    }
  });
};

/**
 * @param {string} query
 * @return {Promise(Array.<Anime>)} an array of result anime
 */
HummingbirdAnimeList.search = function(query) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'GET',
      url: 'http://hummingbird.me/api/v1/search/anime?query=' + query.split(' ').join('+'),
      success: (data, textStatus, jqXHR) => resolve(data)
    });
  });
};

export default HummingbirdAnimeList;
