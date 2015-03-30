'use strict';

/**
 * @property {function(string)} onChangeStatus
 * @property {function()} removeFromLibrary
 */
var LibraryItemStatusMixin = {
  onChangeStatus: function(newStatus) {
    this.props.onChangeStatus(newStatus);
  },

  removeFromLibrary: function() {
    this.props.removeFromLibrary();
  }
};

module.exports = LibraryItemStatusMixin;
