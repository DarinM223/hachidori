/** @jsx React.DOM */
'use strict';
import React from 'react/addons';
import AnimeAirDate from '../AnimeAirDate.js';
import AnimeCache from '../AnimeCache.js';
import LibraryItemComponent from './LibraryItem.react.js';
import AnimeItemComponent from './AnimeItem.react.js';
import HummingbirdAnimeList from '../HummingbirdAnimeList.js';

/**
 * @property {string} username
 * @property {string} tab
 * @property {string} filterText
 * @property {Array.<Anime>} searchList
 */
var AnimeListComponent = React.createClass({
  inLibrary: {},
  getInitialState: function() {
    this.HummingbirdApi = new HummingbirdAnimeList(this.props.username, () => {
      var library = this.HummingbirdApi.getList();
      for (var i = 0; i < library.length; i++) {
        AnimeCache.addAnime(library[i].anime.id);
      }
      this.setState({ loading: false, animelist: this.HummingbirdApi.getList() });
    }, (err) => console.log(err));
    return {
      loading: true,
      animelist: null
    };
  },
  update: async function(animeid, updateparams) {
    try {
      var libraryItem = await HummingbirdAnimeList.update(animeid, updateparams);
      var changeOptions = { };
      var libraryIndex = -1;
      for (var i = 0; i < this.state.animelist.length; i++) {
        if (animeid === this.state.animelist[i].anime.id) {
          libraryIndex = i;
          break;
        }
      }
      if (libraryIndex !== -1) { // edit existing anime
        changeOptions[libraryIndex] = {
          $set: libraryItem
        };
        var newlist = React.addons.update(this.state.animelist, changeOptions);

        this.setState({ animelist: newlist });
        return;
      } else { // add new anime
        changeOptions = {
          $push: [libraryItem]
        };
        var newlist = React.addons.update(this.state.animelist, changeOptions);

        AnimeCache.addAnime(libraryItem.anime.id);
        this.setState({ animelist: newlist });
        return;
      }
    } catch (e) {
      throw e;
    }
  },
  remove: async function(animeid) {
    try {
      await HummingbirdAnimeList.removeFromList(animeid);
      var libraryIndex = -1;
      for (var i = 0; i < this.state.animelist.length; i++) {
        if (animeid === this.state.animelist[i].anime.id) {
          libraryIndex = i;
          break;
        }
      }
      if (libraryIndex !== -1) {
        var changeOptions = {
          $splice: [[libraryIndex, 1]]
        };
        var newlist = React.addons.update(this.state.animelist, changeOptions);
        AnimeCache.removeAnime(animeid);
        this.setState({ animelist: newlist });
        return;
      } else {
        throw new Error('Removed item is not in the library!');
      }
    } catch (e) {
      throw e;
    }
  },
  onAirDayChanged: function(newDay) {
    this.forceUpdate();
  },
  render: function() {
    if (this.state.loading) {
      return <h1>Loading data....</h1>
    } else {
      var libraryIndexes = [];
      var current_date = new Date();

      var filteredTabLibrary = null;

      if (this.props.tab === 'all') {
        filteredTabLibrary = this.state.animelist;
      } else {
        filteredTabLibrary = this.state.animelist.filter(function(libraryItem) {
          return libraryItem.status === this.props.tab;
        }.bind(this)).sort(function(a, b) {
          var d_a = AnimeAirDate.getAirDate(a.anime.id);
          var d_b = AnimeAirDate.getAirDate(b.anime.id);
          if (d_a === null) {
            var d = new Date(a.anime.started_airing);
            AnimeAirDate.setAirDate(a.anime.id, d.getDay());
            d_a = d.getDay();
          }
          if (d_b === null) {
            var d = new Date(b.anime.started_airing);
            AnimeAirDate.setAirDate(b.anime.id, d.getDay());
            d_a = d.getDay();
          }
          var difference_a = d_a - current_date.getDay();
          var difference_b = d_b - current_date.getDay();

          // account for anime that airs before today
          if (difference_a < 0) {
            difference_a += 7;
          }
          if (difference_b < 0) {
            difference_b += 7;
          }

          return difference_a - difference_b;
        }.bind(this));
      }

      var filteredLibrary = filteredTabLibrary.filter(function(libraryItem) {
        return libraryItem.anime.title.search(new RegExp(this.props.filterText, 'i')) > -1;
      }.bind(this)).map(function(libraryItem) {
        return <LibraryItemComponent key={libraryItem.anime.id} 
                                     libraryItem={libraryItem} 
                                     update={this.update}
                                     remove={this.remove}
                                     onAirDayChanged={this.onAirDayChanged}/>
      }.bind(this));

      var searchLibrary = this.props.searchList.map(function(anime) {
        if (!AnimeCache.inCache(anime.id)) {
          return <AnimeItemComponent key={anime.id} tab={this.props.tab} anime={anime} update={this.update}/>
        }
      }.bind(this));

      return (
        <div>
          <ul id="anime-list" className="list-group">
            {filteredLibrary}
            {searchLibrary}
          </ul>
        </div>
      );
    }
  }
});

export default AnimeListComponent;
