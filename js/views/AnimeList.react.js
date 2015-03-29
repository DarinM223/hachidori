/** @jsx React.DOM */
'use strict';

var React = require('react/addons')
  , AnimeCache = require('../AnimeCache.js')
  , LibraryItemComponent = require('./LibraryItem.react.js')
  , AnimeItemComponent = require('./AnimeItem.react.js')
  , HummingbirdAnimeList = require('../HummingbirdAnimeList.js')
  , AnimeListMixin = require('./mixins/AnimeListMixin.js');

/**
 * @property {string} username
 * @property {string} tab
 * @property {string} filterText
 * @property {Array.<Anime>} searchList
 * @property {integer} maxLibraryItems
 * @property {integer} itemIncrement
 * @property {function()} onMoreClicked
 */
var AnimeListComponent = React.createClass({
  mixins: [AnimeListMixin],

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
        filteredTabLibrary = this.state.animelist.filter((libraryItem) => {
          return libraryItem.status === this.props.tab;
        }).sort(HummingbirdAnimeList.compareLibraryItems);
      }

      if (this.props.filterText !== '') {
        filteredTabLibrary = filteredTabLibrary.filter((libraryItem) => {
          return libraryItem.anime.title.search(new RegExp(this.props.filterText, 'i')) > -1;
        });
      }

      var filteredLibrary = filteredTabLibrary.slice(0, this.props.maxLibraryItems).map((libraryItem, index) => {
        return <LibraryItemComponent key={libraryItem.anime.id} 
                                     libraryItem={libraryItem} 
                                     update={this.update}
                                     remove={this.remove}
                                     onAirDayChanged={this.onAirDayChanged}/>
      });

      var searchLibrary = this.props.searchList.map((anime) => {
        if (!AnimeCache.inCache(anime.id)) {
          return <AnimeItemComponent key={anime.id} tab={this.props.tab} anime={anime} update={this.update}/>
        }
      });

      var moreButton = null;

      if (filteredTabLibrary.length > this.props.maxLibraryItems) {
        moreButton = (
          <input type="button" className="btn btn-default btn-lg btn-block" onClick={this.props.onMoreClicked} value="Load more library items"></input>
        );
      }


      return (
        <div>
          <ul id="anime-list" className="list-group">
            {filteredLibrary}
            {moreButton}
            {searchLibrary}
          </ul>
        </div>
      );
    }
  }
});

module.exports = AnimeListComponent;
