/** @jsx React.DOM */
'use strict';

/**
 * @property {string} tab
 * @property {Anime} anime
 * @property {integer,updateparams} update
 */
var AnimeItemComponent = React.createClass({displayName: 'AnimeItemComponent',
  onAdd: function() {
    this.props.update(this.props.anime.id, {
      status: this.props.tab,
      privacy: 'public'
    });
  },
  toggleDescription: function(event) {
    var html = React.renderToString(React.createElement(AnimeDetailComponent, {
      imageURL: this.props.anime.cover_image, 
      detail: this.props.anime.synopsis}));
    $(this.refs.title.getDOMNode()).popover({
      placement: 'bottom',
      html: true,
      content: html
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
          React.createElement("h2", {className: "anime-title", ref: "title", onMouseEnter: this.toggleDescription}, this.props.anime.title)
        )
      )
    );
  }
});
