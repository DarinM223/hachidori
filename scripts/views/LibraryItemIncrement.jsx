'use strict';

/**
 * @property {LibraryItem} libraryItem
 * @property {function()} onClicked
 */
var LibraryItemIncrementComponent = React.createClass({
  onClicked: function() {
    if (this.props.libraryItem.episodes_watched !== null && 
         (this.props.libraryItem.episodes_watched < this.props.libraryItem.anime.episode_count || 
          this.props.libraryItem.anime.episode_count === null)) {
      this.props.onClicked();
    }
  },
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
