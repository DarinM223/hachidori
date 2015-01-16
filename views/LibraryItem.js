/** @jsx React.DOM */
'use strict';

/**
 * @property {function(integer, updateparams)} update
 * @property {function(integer)} remove
 * @property {LibraryItem} libraryItem
 */
var LibraryItemComponent = React.createClass({
  getInitialState: function() {
    return {
      episodesText: this.props.libraryItem.episodes_watched
    };
  },
  onIncrement: function(event) {
    this.props.update(this.props.libraryItem.anime.id, { 
      episodes_watched: this.props.libraryItem.episodes_watched+1 
    }, function(err) {
      // set the state's episode watched back to the properties episode watched
      if (this.isMounted()) {
        this.setState({ episodesText: this.props.libraryItem.episodes_watched }); 
      }
    }.bind(this));
  },
  onChangeStatus: function(statusString) {
    if (statusString !== this.props.libraryItem.status) {
      this.props.update(this.props.libraryItem.anime.id, { status: statusString });
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
        this.props.update(this.props.libraryItem.anime.id, { episodes_watched: num });
      }
    }
  },
  removeFromLibrary: function() {
    this.props.remove(this.props.libraryItem.anime.id);
  },
  onRatingChanged: function(newRating) {
    this.props.update(this.props.libraryItem.anime.id, {
      sane_rating_update: parseFloat(newRating)
    }, function(err) {
      if (err) {
        console.log(err);
      }
    });
  },
  toggleDescription: function(event) {
    var html = React.renderToString(<AnimeDetailComponent 
      imageURL={this.props.libraryItem.anime.cover_image} 
      detail={this.props.libraryItem.anime.synopsis}/>);
    $(this.refs.title.getDOMNode()).popover({
      placement: 'bottom',
      html: true,
      content: html
    });
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
          <span>{'\u00a0'}</span>
          <span>{'\u00a0'}</span>
          <div className="spacer"></div>
          <h1 className="episode">
            <input type="text" size="1"  
              value={this.state.episodesText} 
              onChange={this.onChangeEpisodes}
              onBlur={this.saveChangeEpisodes}
              />
            /{totalEpisodesText}
          </h1>
          <h2 className="anime-title" ref="title" onMouseEnter={this.toggleDescription}>{this.props.libraryItem.anime.title}</h2>
          <LibraryItemStatusComponent libraryItem={this.props.libraryItem} 
            onChangeStatus={this.onChangeStatus}
            removeFromLibrary={this.removeFromLibrary}/>
          <LibraryItemRatingComponent libraryItem={this.props.libraryItem} onChangeRating={this.onRatingChanged}/>
        </li>
      </div>
    );
  }
});