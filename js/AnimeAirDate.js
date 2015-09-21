'use strict';

exports = module.exports = {};

var ServerStorage = require('./ServerStorage.js');

exports.getAirDate = function(animeid) {
  return ServerStorage.getItem('anime-air-date:' + animeid);
};

/**
 * @param {integer} animeid
 * @return {integer} day of the week from 0 to 6
 */
exports.getAirDate = function(animeid) {
  return ServerStorage.getItem('anime-air-date:'+animeid);
};

/**
 * @param {integer} animeid 
 * @param {integer} day day of the week from 0 to 6
 */
exports.setAirDate = function(animeid, day) {
  ServerStorage.setItem('anime-air-date:' + animeid, day);
};

