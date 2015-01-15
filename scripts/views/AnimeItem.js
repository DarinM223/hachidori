/** @jsx React.DOM */
'use strict';

/**
 * @property {Anime} anime
 * @property {integer,updateparams} update
 */
var AnimeItemComponent = React.createClass({
  onAdd: function() {
    this.props.update(this.props.anime.id, {
      status: 'currently-watching',
      privacy: 'public'
    });
  },
  render: function() {
    return (
      <div>
        <li className="list-group-item" >
          <AnimeItemAddComponent anime={this.props.anime} onClicked={this.onAdd}/>
          <span>{'\u00a0'}</span>
          <span>{'\u00a0'}</span>
          <div className="spacer"></div>
          <h1 className="episode">
            _/{this.props.anime.episode_count}
          </h1>
        	<h1 className="anime-title">{this.props.anime.title}</h1>
        </li>
      </div>
    );
  }
});
