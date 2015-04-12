/** @jsx React.DOM */
'use strict';

var React = require('react');

/**
 * @property {string} title
 * @property {string} imageURL
 * @property {string} detail
 */
var AnimeDetailComponent = React.createClass({
  titleStyle: {
    textAlign: 'center'
  },
  render: function() {
    return (
      <div>
        <b style={this.titleStyle}>{this.props.title}</b>
        <div className="anime-detail-container"> 
          <img className="anime-cover-image" src={this.props.imageURL} /> 
        	<p className="anime-detail">{this.props.detail}</p>
        </div>
      </div>
    );
  }
});

module.exports = AnimeDetailComponent;
