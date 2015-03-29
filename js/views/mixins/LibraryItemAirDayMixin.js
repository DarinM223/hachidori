'use strict';

var AnimeAirDate = require('../../AnimeAirDate.js');

/**
 * @param {LibraryItem} libraryItem
 * @param {function(integer)} onChangeAirDay
 */
var LibraryItemAirDayMixin = {
  onChangeAirDay: function(dayOfWeek) {
    AnimeAirDate.setAirDate(this.props.libraryItem.anime.id, dayOfWeek);
    this.props.onChangeAirDay(dayOfWeek);
  }
};

module.exports = LibraryItemAirDayMixin;
