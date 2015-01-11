'use strict';

/**
 * @property {LibraryItem} libraryItem
 */
var LibraryItemComponent = React.createClass({
  getInitialState: function() {
    var retValue = {};
    if (this.props.libraryItem.anime.title === null) {
      retValue.title = "";
    } else {
      retValue.title = this.props.libraryItem.anime.title;
    }

    retValue.episodes_watched = this.props.libraryItem.episodes_watched;
    retValue.total_episodes = this.props.libraryItem.anime.episode_count;
    return retValue;
  },
  onIncrementClicked: function() {
    if (this.state.episodes_watched !== null && 
        (this.state.episodes_watched < this.state.total_episodes || this.state.total_episodes === null)) {
      this.setState({
        episodes_watched: this.state.episodes_watched+1
      });
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
    var episodesWatchedText = this.state.episodes_watched;
    var totalEpisodesText = this.state.total_episodes;
    if (this.state.episodes_watched === null) {
      episodesWatchedText = '_';
    }
    if (this.state.total_episodes === null) {
      totalEpisodesText = '_';
    }

    var button = <input type="button" className="btn btn-warning btn-lg disabled" value="^"/>
    if (this.state.total_episodes === null || 
                     this.state.episodes_watched < this.state.total_episodes) {
      button = <input type="button" className="btn btn-warning btn-lg" onClick={this.onIncrementClicked} value="^"/>
    } 

    return (
      <li className="list-group-item">
        {button}
        &nbsp;
        &nbsp;
        <div style={this.spacerStyle} className="spacer"></div>
        <h1 style={this.episodeStyle}>{episodesWatchedText}/{totalEpisodesText}</h1>
      	<h1 style={this.titleStyle}>{this.state.title}</h1>
      </li>
    );
  }
});
