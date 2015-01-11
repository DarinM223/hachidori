/**
 * @property {LibraryItem} libraryItem
 */
var LibraryItemComponent = React.createClass({
  getInitalState: function() {
    var retValue = {};
    if (this.props.libraryItem.anime.title === null) {
      retValue.title = "";
    } else {
      retValue.title = this.props.libraryItem.anime.title;
    }

    if (this.props.libraryItem.episodes_watched === null) {
      retValue.episodes_watched = 0;
    } else {
      retValue.episodes_watched = this.props.libraryItem.episodes_watched;
    }
    return retValue;
  },
  onIncrementClicked: function() {
    this.setState({
      episodes_watched: this.state.episodes_watched+1
    });
  },
  titleStyle: {
    display: 'inline',
    verticalAlign: 'middle'
  },
  render: function() {
    return (
      <li className="list-group-item">
        <input type="button" className="btn btn-warning btn-lg" onClick={this.onIncrementClicked} value="^"/>
        &nbsp;
        &nbsp;
      	<h1 style={this.titleStyle}>{this.props.libraryItem.anime.title}</h1>
      </li>
    );
  }
});
