/** @jsx React.DOM */
'use strict';

/**
 * @property {string} username
 * @property {string} tab
 * @property {string} filterText
 * @property {Array.<Anime>} searchList
 */
var AnimeListComponent = React.createClass({displayName: 'AnimeListComponent',
  inLibrary: {},
  getInitialState: function() {
    this.HummingbirdApi = new HummingbirdAnimeList(this.props.username, function(err) {
      var library = this.HummingbirdApi.getList();
      for (var i = 0; i < library.length; i++) {
        AnimeCache.addAnime(library[i].anime.id);
      }
      this.setState({ loading: false, animelist: this.HummingbirdApi.getList() });
    }.bind(this));
    return {
      loading: true,
      animelist: null
    };
  },
  update: function(animeid, updateparams, callback) {
    this.HummingbirdApi.update(animeid, updateparams, function(err, libraryItem) {
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

        this.setState({ animelist: newlist }, callback);
      } else { // add new anime
        changeOptions = {
          $push: [libraryItem]
        };
        var newlist = React.addons.update(this.state.animelist, changeOptions);

        AnimeCache.addAnime(libraryItem.anime.id);
        this.setState({ animelist: newlist }, callback);
      }
    }.bind(this));
  },
  remove: function(animeid, callback) {
    this.HummingbirdApi.removeFromList(animeid, function(err) {
      if (!err) {
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
          this.setState({ animelist: newlist }, callback);
        } else {
          alert('Removed item is not in the library!');
        }
      }
    }.bind(this));
  },
  onAirDayChanged: function(newDay) {
    this.forceUpdate();
  },
  render: function() {
    if (this.state.loading) {
      return React.createElement("h1", null, "Loading data....")
    } else {
      var libraryIndexes = [];
      var current_date = new Date();

      for (var i = 0; i < this.state.animelist.length; i++) {
        if (this.props.tab === 'all') {
          libraryIndexes.push(i);
        } else if (this.props.tab === this.state.animelist[i].status) {
          libraryIndexes.push(i);
        }
      }

      var filteredLibrary = libraryIndexes.sort(function(a, b) {
        var d_a = AnimeAirDate.getAirDate(this.state.animelist[a].anime.id);
        if (d_a === null) { // if no set air day, default to first air date
          var d = new Date(this.state.animelist[a].anime.started_airing);
          AnimeAirDate.setAirDate(this.state.animelist[a].anime.id, d.getDay());
          d_a = AnimeAirDate.getAirDate(this.state.animelist[a].anime.id);
        }
        var d_b = AnimeAirDate.getAirDate(this.state.animelist[b].anime.id);
        if (d_b === null) { // if no set air day, default to first air date
          var d = new Date(this.state.animelist[b].anime.started_airing);
          AnimeAirDate.setAirDate(this.state.animelist[b].anime.id, d.getDay());
          d_b = AnimeAirDate.getAirDate(this.state.animelist[b].anime.id);
        }
        var difference_a = d_a - current_date.getDay();
        // account for anime that airs before today
        var difference_b = d_b - current_date.getDay();
        if (difference_a < 0) {
          difference_a = 7 - difference_a;
        }
        if (difference_b < 0) {
          difference_b = 7 - difference_b;
        }
        return difference_a - difference_b;
      }.bind(this)).filter(function(libraryIndex) {
        return this.state.animelist[libraryIndex].anime.title.search(new RegExp(this.props.filterText, 'i')) > -1;
      }.bind(this)).map(function(libraryIndex) {
        return React.createElement(LibraryItemComponent, {key: this.state.animelist[libraryIndex].anime.id, 
                                     libraryItem: this.state.animelist[libraryIndex], 
                                     update: this.update, 
                                     remove: this.remove, 
                                     onAirDayChanged: this.onAirDayChanged})
      }.bind(this));

      var searchLibrary = this.props.searchList.map(function(anime) {
        if (!AnimeCache.inCache(anime.id)) {
          return React.createElement(AnimeItemComponent, {key: anime.id, tab: this.props.tab, anime: anime, update: this.update})
        }
      }.bind(this));

      return (
        React.createElement("div", null, 
          React.createElement("ul", {id: "anime-list", className: "list-group"}, 
            filteredLibrary, 
            searchLibrary
          )
        )
      );
    }
  }
});
