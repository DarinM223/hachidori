/** @jsx React.DOM */
'use strict';

/**
 * @property {string} imageURL
 * @property {string} detail
 */
var AnimeDetailComponent = React.createClass({displayName: 'AnimeDetailComponent',
  render: function() {
    return (
      React.createElement("div", {className: "anime-detail-container"}, 
        React.createElement("img", {className: "anime-cover-image", src: this.props.imageURL}), 
      	React.createElement("p", {className: "anime-detail"}, this.props.detail)
      )
    );
  }
});
