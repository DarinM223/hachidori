/**
 * @property {Array.<LibraryItem>} data
 */
var AnimeListComponent = React.createClass({
  render: function() {
    console.log(this.props.data);
    var library = this.props.data.map(function(libraryItem) {
      return <LibraryItemComponent libraryItem={libraryItem} />
    });

    return (
      <ul id="anime-list" className="list-group">
        {library}
      </ul>
    );
  }
});
