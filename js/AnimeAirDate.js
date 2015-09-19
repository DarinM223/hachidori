'use strict';

var ServerStorage = require('./ServerStorage.js');

var AnimeAirDate = {};

AnimeAirDate.getAirDate = function(animeid) {
  return ServerStorage.getItem('anime-air-date:' + animeid);
};

/**
 * @param {integer} animeid
 * @return {integer} day of the week from 0 to 6
 */
AnimeAirDate.getAirDate = function(animeid) {
  return ServerStorage.getItem('anime-air-date:'+animeid);
};

/**
 * @param {integer} animeid 
 * @param {integer} day day of the week from 0 to 6
 */
AnimeAirDate.setAirDate = function(animeid, day) {
  ServerStorage.setItem('anime-air-date:' + animeid, day);
};

module.exports = AnimeAirDate;
