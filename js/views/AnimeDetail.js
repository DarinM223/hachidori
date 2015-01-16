/** @jsx React.DOM */
'use strict';

/**
 * @property {string} imageURL
 * @property {string} detail
 */
var AnimeDetailComponent = React.createClass({displayName: "AnimeDetailComponent",
  render: function() {
    return (
      React.createElement("div", {className: "anime-detail-container"}, 
        React.createElement("img", {src: this.props.imageURL, width: "200", height: "300"}), 
      	React.createElement("p", {className: "anime-detail"}, this.props.detail)
      )
    );
  }
});
