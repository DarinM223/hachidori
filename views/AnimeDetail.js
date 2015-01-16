/** @jsx React.DOM */
'use strict';

/**
 * @property {string} imageURL
 * @property {string} detail
 */
var AnimeDetailComponent = React.createClass({
  render: function() {
    return (
      <div className="anime-detail-container"> 
        <img className="anime-cover-image" src={this.props.imageURL} /> 
      	<p className="anime-detail">{this.props.detail}</p>
      </div>
    );
  }
});
