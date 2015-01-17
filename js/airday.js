var AnimeAirDate = {};

/**
 * @param {integer} animeid
 * @return {integer} day of the week from 0 to 6
 */
AnimeAirDate.getAirDate = function(animeid) {
  if (typeof(Storage) !== 'undefined' && localStorage !== undefined) {
    return localStorage.getItem('anime-air-date:'+animeid);
  }
};

/**
 * @param {integer} animeid 
 * @param {integer} day day of the week from 0 to 6
 */
AnimeAirDate.setAirDate = function(animeid, day) {
  if (typeof(Storage) !== 'undefined' && localStorage !== undefined) {
    localStorage.setItem('anime-air-date:' + animeid, day);
  }
};
