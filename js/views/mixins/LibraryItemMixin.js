'use strict';

/**
 * @property {function(integer, updateparams)} update
 * @property {function(integer)} onAirDayChanged
 * @property {function(integer)} remove
 * @property {LibraryItem} libraryItem
 */
var LibraryItemMixin = {
  getInitialState: function() {
    return {
      episodesText: this.props.libraryItem.episodes_watched
    };
  },

  onIncrement: function() {
    this.props.update(this.props.libraryItem.anime.id, {
      episodes_watched: this.props.libraryItem.episodes_watched+1 
    }).then(() => {
      // set the state's episode watched back to the properties episode watched
      if (this.isMounted()) {
        this.setState({ episodesText: this.props.libraryItem.episodes_watched }); 
      }
    });
  },

  onChangeStatus: function(statusString) {
    if (statusString !== this.props.libraryItem.status) {
      this.props.update(this.props.libraryItem.anime.id, { status: statusString });
    }
  },

  onChangeEpisodes: function(event) {
    var isnum = /^\d+$/.test(event.target.value);
    var num = parseInt(event.target.value, 10);
    if ((isnum && !isNaN(num) && 
         (this.props.libraryItem.anime.episode_count === null || num <= this.props.libraryItem.anime.episode_count)) || 
         event.target.value === '') {
      this.setState({ episodesText: event.target.value });
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

  onRatingChanged: function(newRating) {
    this.props.update(this.props.libraryItem.anime.id, {
      sane_rating_update: parseFloat(newRating)
    }).catch((e) => {
      console.log(e);
    });
  },

  onAirDayChanged: function(newDay) {
    this.props.onAirDayChanged(newDay);
  }
};

module.exports = LibraryItemMixin;
