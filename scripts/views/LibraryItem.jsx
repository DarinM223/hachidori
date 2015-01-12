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
      popover: false,
      episodesText: this.props.libraryItem.episodes_watched
    };
  },
  onIncrement: function(event) {
    var _this = this;
    if (this.props.libraryItem.episodes_watched !== null && 
         (this.props.libraryItem.episodes_watched < this.props.libraryItem.anime.episode_count || 
          this.props.libraryItem.anime.episode_count === null)) {
      this.props.update(this, { episodes_watched: this.props.libraryItem.episodes_watched+1 }, function(err) {
        // set the state's episode watched back to the properties episode watched
        _this.setState({ episodesText: _this.props.libraryItem.episodes_watched }); 
      });
    } 
  },
  onClick: function(event) {
    this.setState({ popover: !this.state.popover });
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
    var DropdownButton = window.ReactBootstrap.DropdownButton;
    var MenuItem = window.ReactBootstrap.MenuItem;

    var episodesWatchedText = this.props.libraryItem.episodes_watched;
    var totalEpisodesText = this.props.libraryItem.anime.episode_count;
    if (this.props.libraryItem.episodes_watched === null) {
      episodesWatchedText = '_';
    }
    if (this.props.libraryItem.anime.episode_count === null) {
      totalEpisodesText = '_';
    }

    var statusText = "";
    switch (this.props.libraryItem.status) {
      case 'currently-watching':
        statusText = 'Currently Watching';
        break;
      case 'plan-to-watch':
        statusText = 'Plan to Watch';
        break;
      case 'completed':
        statusText = 'Completed';
        break;
      case 'on-hold':
        statusText = 'On Hold';
        break;
      case 'dropped':
        statusText = 'Dropped';
        break;
    }

    var button = <input type="button" className="btn btn-warning btn-lg disabled" value="^"/>
    if (this.props.libraryItem.anime.episode_count === null || 
        this.props.libraryItem.episodes_watched < this.props.libraryItem.anime.episode_count) {
      button = <input type="button" className="btn btn-warning btn-lg" onClick={this.onIncrement} value="^"/>
    } 


    var popoverElement = null;
    if (this.state.popover) {
      popoverElement = (
        <div>
          <label htmlFor="dropdown-status">Status: &nbsp;</label>
          <DropdownButton id="dropdown-status" title={statusText}>
            <MenuItem href="#" onClick={this.onChangeStatus.bind(this,'currently-watching')}>Currently watching</MenuItem>
            <MenuItem href="#" onClick={this.onChangeStatus.bind(this,'completed')}>Completed</MenuItem>
            <MenuItem href="#" onClick={this.onChangeStatus.bind(this,'plan-to-watch')}>Plan to Watch</MenuItem>
            <MenuItem href="#" onClick={this.onChangeStatus.bind(this,'on-hold')}>On Hold</MenuItem>
            <MenuItem href="#" onClick={this.onChangeStatus.bind(this,'dropped')}>Dropped</MenuItem>
          </DropdownButton>
        </div>
      );
    }

    return (
      <div>
        <li className="list-group-item" >
          {button}
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
        	<h1 style={this.titleStyle} onClick={this.onClick}>{this.props.libraryItem.anime.title}</h1>
          {popoverElement}
        </li>
      </div>
    );
  }
});
