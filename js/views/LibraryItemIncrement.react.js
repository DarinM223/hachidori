'use strict';

var React = require('react')
  , LibraryItemIncrementMixin = require('./mixins/LibraryItemIncrementMixin.js');

/**
 * @property {LibraryItem} libraryItem
 * @property {function()} onClicked
 */
var LibraryItemIncrementComponent = React.createClass({
  mixins: [LibraryItemIncrementMixin],

  render: function() {
    if (this.props.libraryItem.anime.episode_count === null || 
        this.props.libraryItem.episodes_watched < this.props.libraryItem.anime.episode_count) {
      return (
        <input type="button" className="btn btn-warning btn-lg" onClick={this.onClicked} value="^"/>
      );
    } else {
      return (
        <input type="button" className="btn btn-warning btn-lg disabled" value="^"/>
      );
    }
  }
});

module.exports = LibraryItemIncrementComponent;

