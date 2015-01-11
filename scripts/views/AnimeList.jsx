'use strict';

/**
 * @property {Array.<LibraryItem>} data
 * @property {string} filterText
 */
var AnimeListComponent = React.createClass({
  render: function() {
    var _this = this;
    var library = this.props.data.filter(function(libraryItem) {
      return libraryItem.anime.title.search(new RegExp(_this.props.filterText, 'i')) > -1;
    }).map(function(libraryItem) {
      // don't forget to add the key element to arrays so you don't lose data!
      return <LibraryItemComponent key={libraryItem.anime.id} libraryItem={libraryItem} />
    });

    return (
      <ul id="anime-list" className="list-group">
        {library}
      </ul>
    );
  }
});
