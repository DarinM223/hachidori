'use strict';

var AnimeCache = {
  _cache: {},
  addAnime: function(animeid) {
    this._cache[animeid+''] = true;
  },
  removeAnime: function(animeid) {
    this._cache[animeid+''] = false;
  },
  inCache: function(animeid) {
    var result = this._cache[animeid+''];
    if (result === undefined || result === null || result === false) {
      return false;
    }
    return true;
  }
};


