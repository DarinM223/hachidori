'use strict';

/**
 * @property {LibraryItem} libraryItem
 * @property {function()} onClicked
 */
var LibraryItemIncrementMixin = {
  onClicked: function() {
    if (this.props.libraryItem.episodes_watched !== null && 
         (this.props.libraryItem.episodes_watched < this.props.libraryItem.anime.episode_count || 
          this.props.libraryItem.anime.episode_count === null)) {
      this.props.onClicked();
    }
  }
};

module.exports = LibraryItemIncrementMixin;
