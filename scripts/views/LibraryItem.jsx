'use strict';

/**
 * @property {function(animeid, updateparams, callback)} onIncrement
 * @property {LibraryItem} libraryItem
 */
var LibraryItemComponent = React.createClass({
  onIncrement: function(event) {
    if (this.props.libraryItem.episodes_watched !== null && 
         (this.props.libraryItem.episodes_watched < this.props.libraryItem.anime.episode_count || 
          this.props.libraryItem.anime.episode_count === null)) {
      this.props.onIncrement(this);
    } 
  },
  titleStyle: {
    display: 'inline-block',
    verticalAlign: 'middle',
    overflow: 'hidden'
  },
  episodeStyle: {
    display: 'inline-block',
    verticalAlign: 'middle',
    float: 'right',
    clear: 'right',
    overflow: 'hidden'
  },
  spacerStyle: {
    width: '0px',
    float: 'right'
  },
  render: function() {
    var episodesWatchedText = this.props.libraryItem.episodes_watched;
    var totalEpisodesText = this.props.libraryItem.anime.episode_count;
    if (this.props.libraryItem.episodes_watched === null) {
      episodesWatchedText = '_';
    }
    if (this.props.libraryItem.anime.episode_count === null) {
      totalEpisodesText = '_';
    }

    var button = <input type="button" className="btn btn-warning btn-lg disabled" value="^"/>
    if (this.props.libraryItem.anime.episode_count === null || 
        this.props.libraryItem.episodes_watched < this.props.libraryItem.anime.episode_count) {
      button = <input type="button" className="btn btn-warning btn-lg" onClick={this.onIncrement} value="^"/>
    } 

    return (
      <li className="list-group-item">
        {button}
        &nbsp;
        &nbsp;
        <div style={this.spacerStyle} className="spacer"></div>
        <h1 style={this.episodeStyle}>{episodesWatchedText}/{totalEpisodesText}</h1>
      	<h1 style={this.titleStyle}>{this.props.libraryItem.anime.title}</h1>
      </li>
    );
  }
});
