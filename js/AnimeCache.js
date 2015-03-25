'use strict';

import Cache from './Cache.js';

var AnimeCache = new Cache();

/**
 * @param {integer} animeid
 */
AnimeCache.addAnime = function(animeid) {
  this.set(animeid+'', true);
};

/**
 * @param {integer} animeid
 */
AnimeCache.removeAnime = function(animeid) {
  this.remove(animeid+'');
};

export default AnimeCache;
