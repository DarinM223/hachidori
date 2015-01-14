'use strict';

/**
 * @property {string} username
 * @property {string} tab
 * @property {string} filterText
 * @property {Array.<Anime>} searchList
 */
var AnimeListComponent = React.createClass({
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
  render: function() {
    if (this.state.loading) {
      return <h1>Loading data....</h1>
    } else {
      var libraryIndexes = [];

      for (var i = 0; i < this.state.animelist.length; i++) {
        if (this.props.tab === 'all') {
          libraryIndexes.push(i);
        } else if (this.props.tab === this.state.animelist[i].status) {
          libraryIndexes.push(i);
        }
      }

      var filteredLibrary = libraryIndexes.filter(function(libraryIndex) {
        return this.state.animelist[libraryIndex].anime.title.search(new RegExp(this.props.filterText, 'i')) > -1;
      }.bind(this)).map(function(libraryIndex) {
        return <LibraryItemComponent key={this.state.animelist[libraryIndex].anime.id} 
                                     libraryItem={this.state.animelist[libraryIndex]} 
                                     update={this.update}
                                     remove={this.remove}/>
      }.bind(this));

      var searchLibrary = this.props.searchList.map(function(anime) {
        if (!AnimeCache.inCache(anime.id)) {
          return <AnimeItemComponent key={anime.id} anime={anime} update={this.update}/>
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
