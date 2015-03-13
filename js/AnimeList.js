'use strict';

var AnimeCache = require('./AnimeCache.js')
  , RBTree = require('bintrees').RBTree;

/**
 * Represents an animelist which is represented as a red-black tree
 * @param {string} username
 * @constructor
 */
function AnimeList(username) {
  this.username = username;
  this.rbtree = new RBTree(AnimeList.compareLibraryItems);
}

/**
 * Adds library item to anime list
 * @param {LibraryItem} a the library item to insert
 * @return {boolean} true if inserted, false if duplicate
 */
AnimeList.prototype.addLibraryItem = function(a) {
  var res = rbtree.insert(a);
  if (res === true) {
    AnimeCache.addAnime(a.anime.id);
  }
  return res;
};

/**
 * If library item is not in the anime list, it inserts it, otherwise it replaces the existing library item
 * @param {LibraryItem} a the library item to set
 * @return {boolean} true if properly set, false otherwise
 */
AnimeList.prototype.setLibraryItem = function(a) {
  var res = false;
  if (rbtree.find(a) === null) { // anime not in tree
    res = rbtree.insert(a);
    if (res === true) {
      AnimeCache.addAnime(a.anime.id);
    }
    return res;
  } else { // if anime in tree attempt to remove anime and reinsert it
    if (rbtree.remove(a) === true) {
      return rbtree.insert(a);
    }
    return false;
  }
};

/**
 * Removes the library item from the anime list
 * @param {LibraryItem} a the library item to remove
 * @return {boolean} true if removed
 */
AnimeList.prototype.removeLibraryItem = function(a) {
  var res = rbtree.remove(a);
  if (res === true) {
    AnimeCache.removeAnime(a.anime.id);
  }
  return res;
};

/**
 * @return {boolean} true if library item is in the anime list
 */
AnimeList.prototype.hasAnime = function(a) {
  return rbtree.find(a);
};

/**
 * Calls a function on all data in order
 * @param {function(LibraryItem)} cb the function to apply to every element in order
 */
AnimeList.prototype.each = function(cb) {
  rbtree.each(cb);
};

/**
 * Similar to each() but returns an array of results
 * @param {function(LibraryItem)} cb the function to apply to every element in order and returns something
 * @return {Array<Any>} results of map
 */
AnimeList.prototype.map = function(cb) {
  var results = [];
  this.each(function(a) {
    results.push(cb(a));
  });
  return results;
};

(function() { // wrap current_date as private
  var current_date = new Date();

  /**
   * Compares two library items in order of how close they are to today
   * The order of comparison is as follows:
   *
   * 0. If the anime id of a is equal to b, then the result is always 0
   *
   * 1. How close the day is to today (if today is monday, anime on monday > anime on tuesday > anime on wednesday, etc)
   *
   * 2. How much you are caught up (less episodes watched means higher on the list b/c you want to catch up first)
   * (anime that is 17/24 > anime that is 3/12 because 24 - 17 = 7 and 12 - 3 = 9 and 9 - 7 > 0, 
   * so 3/12 will appear first then 17/24)
   *
   * 3. The ratings of the anime (higher rank is higher on the list)
   *
   * 4. If there is an error or if there is nothing left to compare, then it compares based on the anime id of the library item
   *
   * @param {LibraryItem} a first anime library item
   * @param {LibraryItem} b second anime library item
   * @return {integer} positive if a is "greater than" b, negative if a is "less than" b, 0 if a is "equal to" b
   */
  AnimeList.compareLibraryItems = function(a, b) {
    if (a.anime.id === b.anime.id) return 0; // equality for searching for right item in tree

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

    var result = difference_a - difference_b;

    if (result === 0) { // if both anime air on the same day
      // return the difference of the total # of episodes - # episodes watched
      if (a.episodes_watched && a.anime.episode_count && b.episodes_watched && b.anime.episode_count) {
        var newResult = (b.anime.episode_count - b.episodes_watched) - (a.anime.episode_count - a.episodes_watched);

        if (newResult === 0) { // if both anime have the same # of episodes watched relationally
          // return the difference of their ratings
          if (b.rating && a.rating && b.rating.value && a.rating.value) {
            if (b.rating.value - a.rating.value === 0) return a.anime.id - b.anime.id;
            else return b.rating.value - a.rating.value;
          } else {
            return a.anime.id - b.anime.id;
          }
        } else {
          return newResult;
        }
      } else {
        return a.anime.id - b.anime.id;
      }
    } else {
      return result;
    }
  };
})();

module.exports = AnimeList;
