'use strict';

/**
 * @property {string} username
 * @property {string} tab
 * @property {string} filterText
 */
var AnimeListComponent = React.createClass({
  getInitialState: function() {
    var _this = this;
    this.HummingbirdApi = new HummingbirdAnimeList(this.props.username, function(err) {
      _this.setState({ loading: false, animelist: _this.HummingbirdApi.getList() });
    });
    return {
      loading: true,
      animelist: null
    };
  },
  incrementAnime: function(childComponent) {
    var _this = this;
    this.HummingbirdApi.update(childComponent.props.libraryItem.anime.id, { increment_episodes: true }, function(err, libraryItem) {
      var libraryIndex = -1;
      for (var i = 0; i < _this.state.animelist.length; i++) {
        if (childComponent.props.libraryItem.id === _this.state.animelist[i].id) {
          libraryIndex = i;
          break;
        }
      }
      var incrementOptions = { };
      incrementOptions[libraryIndex] = {
        $set: libraryItem
      };
      var newlist = React.addons.update(_this.state.animelist, incrementOptions);

      _this.setState({ animelist: newlist });
    });
  },
  render: function() {
    var _this = this;

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
        return _this.state.animelist[libraryIndex].anime.title.search(new RegExp(_this.props.filterText, 'i')) > -1;
      }).map(function(libraryIndex) {
        return <LibraryItemComponent key={_this.state.animelist[libraryIndex].anime.id} 
                                     libraryItem={_this.state.animelist[libraryIndex]} 
                                     onIncrement={_this.incrementAnime}/>
      });

      return (
        <ul id="anime-list" className="list-group">
          {filteredLibrary}
        </ul>
      );
    }
  }
});
