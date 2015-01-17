'use strict';

var AnimeCache = {
  _cache: {},
  /**
   * @param {integer} animeid
   */
  addAnime: function(animeid) {
    this._cache[animeid+''] = true;
  },
  /**
   * @param {integer} animeid
   */
  removeAnime: function(animeid) {
    this._cache[animeid+''] = false;
  },
  /**
   * @param {integer} animeid
   * @return {boolean} whether anime is in the cache
   */
  inCache: function(animeid) {
    var result = this._cache[animeid+''];
    if (result === undefined || result === null || result === false) {
      return false;
    }
    return true;
  }
};


