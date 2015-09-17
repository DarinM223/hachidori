'use strict';

/*
 * A module that encodes all values as JSON, even non-objects
 * If a value encoded does not have a top-level object, then
 * it is encoded as { "$%^&*()!!": value }
 */

exports = module.exports = {};

const JSON_VALUE_KEY_NAME = '$%^&*()!!';

/**
 * Encodes a value into a JSON string
 * @param {string,integer,float,boolean,Object} value
 * @return {string} the JSON string
 */
exports.encodeJSON = function encodeJSON(value) {
  if (typeof value === 'undefined' || value === null) {
    throw new TypeError(`Error in encodeJSON: \' ${ value } \' is either null or undefined`);
  }
  if (typeof value !== 'object') {
    var newObj = {};
    newObj[JSON_VALUE_KEY_NAME] = value;
    return JSON.stringify(newObj);
  } else {
    return JSON.stringify(value);
  }
};

/**
 * Decodes a JSON string into a value
 * @param {string} str the JSON string
 * @return {string,integer,float,boolean,Object} the value encoded by the string
 */
exports.decodeJSON = function decodeJSON(str) {
  if (typeof str === 'undefined' || str === null) {
    throw new TypeError(`Error in decodeJSON: \' ${ str } \' is either null or undefined`);
  }
  var obj = JSON.parse(str);
  if (typeof obj[JSON_VALUE_KEY_NAME] !== 'undefined' && obj[JSON_VALUE_KEY_NAME] !== null) {
    return obj[JSON_VALUE_KEY_NAME];
  } else {
    return obj;
  }
};

