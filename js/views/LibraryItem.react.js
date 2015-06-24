'use strict';

var React = require('react')
  , LibraryItemStatusComponent = require('./LibraryItemStatus.react.js')
  , LibraryItemIncrementComponent = require('./LibraryItemIncrement.react.js')
  , LibraryItemRatingComponent = require('./LibraryItemRating.react.js')
  , LibraryItemAirDayComponent = require('./LibraryItemAirDay.react.js')
  , AnimeMixin = require('./mixins/AnimeMixin.js')
  , LibraryItemMixin = require('./mixins/LibraryItemMixin.js');

/**
 * @property {function(integer, updateparams)} update
 * @property {function(integer)} onAirDayChanged
 * @property {function(integer)} remove
 * @property {LibraryItem} libraryItem
 */
var LibraryItemComponent = React.createClass({
  mixins: [AnimeMixin, LibraryItemMixin],

  render: function() {
    var episodesWatchedText = this.props.libraryItem.episodes_watched;
    var totalEpisodesText = this.props.libraryItem.anime.episode_count;
    if (this.props.libraryItem.episodes_watched === null) {
      episodesWatchedText = '_';
    }
    if (this.props.libraryItem.anime.episode_count === null) {
      totalEpisodesText = '_';
    }

    return (
      <div>
        <li className="list-group-item" >
          <LibraryItemIncrementComponent libraryItem={this.props.libraryItem} onClicked={this.onIncrement}/>
          &nbsp;&nbsp;
          <div className="spacer"></div>
          <h1 className="episode">
            <input type="text" size="2"  
              value={this.state.episodesText} 
              onChange={this.onChangeEpisodes}
              onBlur={this.saveChangeEpisodes}
              />
            /{totalEpisodesText}
          </h1>

          <h2 className="anime-title" ref="title" onMouseDown={this.toggleDescription.bind(this, this.props.libraryItem.anime)}>
            {this.props.libraryItem.anime.title}
          </h2>

          <LibraryItemStatusComponent libraryItem={this.props.libraryItem} 
            onChangeStatus={this.onChangeStatus}
            removeFromLibrary={this.removeFromLibrary}/>
          <LibraryItemRatingComponent libraryItem={this.props.libraryItem} onChangeRating={this.onRatingChanged}/>
          <LibraryItemAirDayComponent libraryItem={this.props.libraryItem} onChangeAirDay={this.onAirDayChanged}/>
        </li>
      </div>
    );
  }
});

module.exports = LibraryItemComponent;
