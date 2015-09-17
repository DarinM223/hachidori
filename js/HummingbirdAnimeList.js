'use strict';

var HummingbirdAccessToken = require('./HummingbirdAccessToken.js')
  , AnimeAirDate = require('./AnimeAirDate.js')
  , request = require('superagent')
  , _ = require('underscore')
  , LocalStorage = require('./LocalStorage.js');

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

HummingbirdAnimeList.prototype.loadStuff = function() {
  return this._loadList().then(() => {
    return this._loadFavoriteAnime();
  });
};

/**
 * Retrieves the anime list data from hummingbird
 * @return {Promise}
 */
HummingbirdAnimeList.prototype._loadList = function() {
  var that = this;

  return new Promise(function(resolve, reject) {
    request.get(window.location.origin + '/api/v1/users/' + that.username + '/library').end(function(e, res) {
      if (e) {
        that.anime_list = JSON.parse(LocalStorage.getItem('animelist-cached:' + that.username)); 
        reject(e);
      } else {
        that.anime_list = res.body;
        LocalStorage.setItem('animelist-cached:' + that.username, JSON.stringify(that.anime_list)); 
        resolve();
      }
    });
  });
};

/**
 * Retrieves the user's favorite anime from hummingbird
 * @return {Promise}
 */
HummingbirdAnimeList.prototype._loadFavoriteAnime = function() {
  var that = this;

  return new Promise(function(resolve, reject) {
    request.get(window.location.origin + '/api/v1/users/' + that.username + '/favorite_anime').end(function(e, res) {
      if (e) {
        that.favorite_anime = JSON.parse(LocalStorage.getItem('anime-cached:' + that.username + ':favorite'));
        reject(e);
      } else {
        that.favorite_anime = res.body;
        LocalStorage.setItem('anime-cached:' + that.username+':favorite', JSON.stringify(that.favorite_anime));
        resolve();
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
HummingbirdAnimeList.removeFromList = function(animeid) {
  return new Promise(function(resolve, reject) {
    var access_token = new HummingbirdAccessToken();

    if (access_token.getAccessToken() === null) {
      reject(new Error('You are not authorized to perform this action'));
    } else {
      request.post(window.location.origin + '/api/v1/libraries/' + animeid + '/remove')
        .send({ auth_token: access_token.getAccessToken() }).end(function(e) {

        if (e) {
          switch (e.status) {
            case 401:
              reject(new Error('You are not authorized to perform this action'));
              break;
            case 500:
              reject(new Error('There was an internal server error'));
              break;
            default:
              reject(new Error('There was an error with error code: ' + e.status));
              break;
          }
        } else {
          resolve();
        }
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
  return new Promise(function(resolve, reject) {
    var access_token = new HummingbirdAccessToken();
    if (access_token.getAccessToken() === null) {
      reject(new Error('You are not authorized to perform this action'));
    } else {
      var params = _.pick(updateparams, 'status', 'privacy', 'rating', 'rewatching', 
                          'rewatched_times', 'notes', 'episodes_watched', 'increment_episodes', 'sane_rating_update');

      _.extend(params, { id: animeid, auth_token: access_token.getAccessToken() });

      request.post(window.location.origin + '/api/v1/libraries/' + animeid).send(params).end(function(e, res) {
        if (e) {
          switch (e.status) {
            case 401:
              reject(new Error('You are not authorized to perform this action'));
              break;
            case 500:
              reject(new Error('There was an internal server error'));
              break;
            default:
              reject(new Error('There was an error with error code: ' + e.status));
              break;
          }
        } else {
          resolve(res.body);
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
  return new Promise(function(resolve, reject) {
    request.get(window.location.origin + '/api/v1/search/anime?query=' + query.split(' ').join('+')).end(function(e, res) {
      if (e) {
        reject(new Error('Error sending search request'));
      } else {
        resolve(res.body);
      }
    });
  });
};

/*
 * Private functions used for compareLibraryItems function
 */

/**
 * Compares library items based on the "distance" from the current day of the week 
 * (library items closer in day of week to today are ranked higher)
 * @param {LibraryItem} a first anime library item
 * @param {LibraryItem} b second anime library item
 * @return {integer} positive if a is "greater than" b, negative if a is "less than" b, 0 if a is "equal to" b
 */
HummingbirdAnimeList._checkAirDaysOfWeek = function(a, b) {
  var current_date = new Date();

  var d_a = AnimeAirDate.getAirDate(a.anime.id);
  var d_b = AnimeAirDate.getAirDate(b.anime.id);
  if (d_a === null) {
    var d_1 = new Date(a.anime.started_airing);
    AnimeAirDate.setAirDate(a.anime.id, d_1.getDay());
    d_a = d_1.getDay();
  }
  if (d_b === null) {
    var d_2 = new Date(b.anime.started_airing);
    AnimeAirDate.setAirDate(b.anime.id, d_2.getDay());
    d_b = d_2.getDay();
  }

  var difference_a = d_a - current_date.getDay();
  var difference_b = d_b - current_date.getDay();

  // account for anime that airs before today
  if (difference_a < 0) {
    difference_a += 7;
  }
  if (difference_b < 0) {
    difference_b += 7;
  }

  return (difference_a - difference_b);
};

/**
 * Compares library items based on the # of episodes watched (library items with less episodes are
 * ranked higher because you have to catch up)
 * @param {LibraryItem} a first anime library item
 * @param {LibraryItem} b second anime library item
 * @return {integer} positive if a is "greater than" b, negative if a is "less than" b, 0 if a is "equal to" b
 */
HummingbirdAnimeList._checkEpisodeDifferences = function(a, b) {
  // return the difference of the total # of episodes - # episodes watched
  if (a.episodes_watched && a.anime.episode_count && b.episodes_watched && b.anime.episode_count) {
    return ((b.anime.episode_count - b.episodes_watched) - (a.anime.episode_count - a.episodes_watched));
  } else {
    return 0;
  }
};

/**
 * Compares library items based on the rating (higher rating library items are ranked higher
 * because you are more willing to watch it first)
 * @param {LibraryItem} a first anime library item
 * @param {LibraryItem} b second anime library item
 * @return {integer} positive if a is "greater than" b, negative if a is "less than" b, 0 if a is "equal to" b
 */
HummingbirdAnimeList._checkRatingDifferences = function(a, b) {
  if (b.rating && a.rating && b.rating.value && a.rating.value) {
    return b.rating.value - a.rating.value;
  } else {
    return 0;
  }
};

/**
 * Compares two library items in order of how close they are to today
 * The order of comparison is as follows:
 *
 * 1. If the library item anime has already aired 
 * (already aired anime is ranked first, if both are already aired, it is ordered by how many episodes watched)
 *
 * 2. How close the day is to today (if today is monday, anime on monday > anime on tuesday > anime on wednesday, etc)
 *
 * 3. How much you are caught up (less episodes watched means higher on the list b/c you want to catch up first)
 * (anime that is 17/24 > anime that is 3/12 because 24 - 17 = 7 and 12 - 3 = 9 and 9 - 7 > 0, 
 * so 3/12 will appear first then 17/24)
 *
 * 4. The ratings of the anime (higher rank is higher on the list)
 *
 * @param {LibraryItem} a first anime library item
 * @param {LibraryItem} b second anime library item
 * @return {integer} positive if a is "greater than" b, negative if a is "less than" b, 0 if a is "equal to" b
 */
HummingbirdAnimeList.compareLibraryItems = function(a, b) {
  var result = HummingbirdAnimeList._checkAirDaysOfWeek(a, b);
  if (result !== 0) {
    return result;
  }

  result = HummingbirdAnimeList._checkEpisodeDifferences(a, b);
  if (result !== 0) {
    return result;
  }

  return HummingbirdAnimeList._checkRatingDifferences(a, b);
};

module.exports = HummingbirdAnimeList;
