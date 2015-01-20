'use strict';

var AnimeCache = {
  _cache: {}
};

(function() {
  /**
   * @param {integer} animeid
   */
  AnimeCache.addAnime = function(animeid) {
    this._cache[animeid+''] = true;
  };

  /**
   * @param {integer} animeid
   */
  AnimeCache.removeAnime = function(animeid) {
    this._cache[animeid+''] = false;
  };

  /**
   * @param {integer} animeid
   * @return {boolean} whether anime is in the cache
   */
  AnimeCache.inCache = function(animeid) {
    var result = this._cache[animeid+''];
    if (result === undefined || result === null || result === false) {
      return false;
    }
    return true;
  };
})();
