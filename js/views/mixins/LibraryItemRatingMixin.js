'use strict';

/**
 * @property {LibraryItem} libraryItem
 * @property {function(double)} onChangeRating
 */
var LibraryItemRatingMixin = {
  onChangeRating: function(newRating) {
    if (newRating !== this.props.libraryItem.rating.value) {
      this.props.onChangeRating(newRating);
    }
  }
};

module.exports = LibraryItemRatingMixin;
