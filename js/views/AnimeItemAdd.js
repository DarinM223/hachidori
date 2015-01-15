/** @jsx React.DOM */
'use strict';

/**
 * @property {Anime} anime
 * @property {function()} onClicked
 */
var AnimeItemAddComponent = React.createClass({displayName: 'AnimeItemAddComponent',
  onClicked: function() {
    this.props.onClicked();
  },
  render: function() {
    return (
      React.createElement("input", {type: "button", className: "btn btn-danger btn-lg", onClick: this.onClicked, value: "+"})
    );
  }
});
