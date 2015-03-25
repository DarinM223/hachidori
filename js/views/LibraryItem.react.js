/** @jsx React.DOM */
'use strict';

import React from 'react';
import $ from 'jquery';
import LibraryItemStatusComponent from './LibraryItemStatus.react.js';
import LibraryItemIncrementComponent from './LibraryItemIncrement.react.js';
import LibraryItemRatingComponent from './LibraryItemRating.react.js';
import LibraryItemAirDayComponent from './LibraryItemAirDay.react.js';
import HummingbirdAnimeList from '../HummingbirdAnimeList.js';
import LocalStorage from '../LocalStorage.js';
import AnimeItemMixin from './mixins/AnimeItemMixin.react.js';

/**
 * @property {function(integer, updateparams)} update
 * @property {function(integer)} onAirDayChanged
 * @property {function(integer)} remove
 * @property {LibraryItem} libraryItem
 */
var LibraryItemComponent = React.createClass({
  mixins: [AnimeItemMixin],

  getInitialState: function() {
    return {
      episodesText: this.props.libraryItem.episodes_watched
    };
  },

  onIncrement: async function(event) {
    await this.props.update(this.props.libraryItem.anime.id, {
      episodes_watched: this.props.libraryItem.episodes_watched+1 
    });

    // set the state's episode watched back to the properties episode watched
    if (this.isMounted()) {
      this.setState({ episodesText: this.props.libraryItem.episodes_watched }); 
    }
  },

  onChangeStatus: function(statusString) {
    if (statusString !== this.props.libraryItem.status) {
      this.props.update(this.props.libraryItem.anime.id, { status: statusString });
    }
  },

  onChangeEpisodes: function(event) {
    var isnum = /^\d+$/.test(event.target.value);
    var num = parseInt(event.target.value, 10);
    if ((isnum && !isNaN(num) && num <= this.props.libraryItem.anime.episode_count) || event.target.value === '') {
      this.setState({ episodesText: event.target.value });
    } else {
    }
  },

  saveChangeEpisodes: function(event) {
    if (event.target.value === '') {
      this.setState({ episodesText: this.props.libraryItem.episodes_watched });
    } else {
      // save new episodes in Hummingbird
      var num = parseInt(event.target.value, 10);
      if (!isNaN(num)) {
        this.props.update(this.props.libraryItem.anime.id, { episodes_watched: num });
      }
    }
  },

  removeFromLibrary: function() {
    this.props.remove(this.props.libraryItem.anime.id);
  },

  onRatingChanged: async function(newRating) {
    try {
      await this.props.update(this.props.libraryItem.anime.id, {
        sane_rating_update: parseFloat(newRating)
      });
    } catch (e) {
      console.log(e);
    }
  },

  onAirDayChanged: function(newDay) {
    this.props.onAirDayChanged(newDay);
  },

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
      <div onMouseEnter={this.titleHover.bind(this, this.props.libraryItem.anime) }>
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

export default LibraryItemComponent;
