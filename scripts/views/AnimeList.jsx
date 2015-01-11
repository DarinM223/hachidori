'use strict';

/**
 * @property {string} username
 * @property {string} tab
 * @property {string} filterText
 */
var AnimeListComponent = React.createClass({
  getInitialState: function() {
    var _this = this;
    var animelist = new HummingbirdAnimeList(this.props.username, function(err) {
      _this.setState({ loading: false });
    });
    return {
      loading: true,
      animelist: animelist
    };
  },
  render: function() {
    var _this = this;

    if (this.state.loading) {
      return <h1>Loading data....</h1>
    } else {
      var library;
      switch (this.props.tab) {
        case 'all':
          library = this.state.animelist.getAll();
          break;
        default:
          library = this.state.animelist.getList(this.props.tab);
          break;
      }

      var filteredLibrary = library.filter(function(libraryItem) {
        return libraryItem.anime.title.search(new RegExp(_this.props.filterText, 'i')) > -1;
      }).map(function(libraryItem) {
        // don't forget to add the key element to arrays so you don't lose data!
        return <LibraryItemComponent key={libraryItem.anime.id} libraryItem={libraryItem} />
      });

      return (
        <ul id="anime-list" className="list-group">
          {filteredLibrary}
        </ul>
      );
    }
  }
});
