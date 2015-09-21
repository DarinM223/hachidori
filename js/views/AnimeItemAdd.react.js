'use strict';

var React = require('react');

/**
 * @property {Anime} anime
 * @property {function()} onClicked
 */
var AnimeItemAddComponent = React.createClass({
  onClicked: function() {
    this.props.onClicked();
  },

  render: function() {
    return (
      <input type="button" className="btn btn-danger btn-lg" onClick={this.onClicked} value="+"/>
    );
  }
});

module.exports = AnimeItemAddComponent;

