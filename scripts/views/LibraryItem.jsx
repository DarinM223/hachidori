'use strict';

/**
 * @property {function(this, updateparams)} update
 * @property {LibraryItem} libraryItem
 */
var LibraryItemComponent = React.createClass({
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
  inputStyle: {
    textAlign: 'right'
  },

  getInitialState: function() {
    return {
      episodesText: this.props.libraryItem.episodes_watched
    };
  },
  onIncrement: function(event) {
    this.props.update(this, { episodes_watched: this.props.libraryItem.episodes_watched+1 }, function(err) {
      // set the state's episode watched back to the properties episode watched
      if (this.isMounted()) {
        this.setState({ episodesText: this.props.libraryItem.episodes_watched }); 
      }
    }.bind(this));
  },
  onChangeStatus: function(statusString) {
    if (statusString !== this.props.libraryItem.status) {
      this.props.update(this, { status: statusString });
    }
  },
  onChangeEpisodes: function(event) {
    var isnum = /^\d+$/.test(event.target.value);
    var num = parseInt(event.target.value, 10);
    if ((isnum && !isNaN(num) && num <= this.props.libraryItem.anime.episode_count) || event.target.value === '') {
      this.setState({ episodesText: event.target.value });
    } else {
    }
  },
  saveChangeEpisodes: function(event) {
    if (event.target.value === '') {
      this.setState({ episodesText: this.props.libraryItem.episodes_watched });
    } else {
      // save new episodes in Hummingbird
      var num = parseInt(event.target.value, 10);
      if (!isNaN(num)) {
        this.props.update(this, { episodes_watched: num });
      }
    }
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

    return (
      <div>
        <li className="list-group-item" >
          <LibraryItemIncrementComponent libraryItem={this.props.libraryItem} onClicked={this.onIncrement}/>
          &nbsp;
          &nbsp;
          <div style={this.spacerStyle} className="spacer"></div>
          <h1 style={this.episodeStyle}>
            <input type="text" size="2" style={this.inputStyle} 
              value={this.state.episodesText} 
              onChange={this.onChangeEpisodes}
              onBlur={this.saveChangeEpisodes}
              />
            /{totalEpisodesText}
          </h1>
        	<h1 style={this.titleStyle}>{this.props.libraryItem.anime.title}</h1>
          <LibraryItemStatusComponent libraryItem={this.props.libraryItem} onChangeStatus={this.onChangeStatus}/>
        </li>
      </div>
    );
  }
});
