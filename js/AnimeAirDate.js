'use strict';

var AnimeAirDate = {};

(function(localStorage, Storage) {
  if (typeof(Storage) === 'undefined' || typeof(localStorage) === 'undefined') {
    console.log('localStorage is not defined!');
    return;
  }

  AnimeAirDate.getAirDate = function(animeid) {
    return localStorage.getItem('anime-air-date:' + animeid);
  };

  /**
   * @param {integer} animeid
   * @return {integer} day of the week from 0 to 6
   */
  AnimeAirDate.getAirDate = function(animeid) {
    return localStorage.getItem('anime-air-date:'+animeid);
  };
  
  /**
   * @param {integer} animeid 
   * @param {integer} day day of the week from 0 to 6
   */
  AnimeAirDate.setAirDate = function(animeid, day) {
    localStorage.setItem('anime-air-date:' + animeid, day);
  };
})(localStorage, Storage);

export default AnimeAirDate;
