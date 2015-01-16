/** @jsx React.DOM */
'use strict';

/**
 * @property {Anime} anime
 * @property {integer,updateparams} update
 */
var AnimeItemComponent = React.createClass({displayName: "AnimeItemComponent",
  onAdd: function() {
    this.props.update(this.props.anime.id, {
      status: 'currently-watching',
      privacy: 'public'
    });
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("li", {className: "list-group-item"}, 
          React.createElement(AnimeItemAddComponent, {anime: this.props.anime, onClicked: this.onAdd}), 
          React.createElement("span", null, '\u00a0'), 
          React.createElement("span", null, '\u00a0'), 
          React.createElement("div", {className: "spacer"}), 
          React.createElement("h1", {className: "episode"}, 
            "_/", this.props.anime.episode_count
          ), 
        	React.createElement("h1", {className: "anime-title"}, this.props.anime.title)
        )
      )
    );
  }
});
