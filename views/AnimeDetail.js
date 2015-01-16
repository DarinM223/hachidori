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
        <img src={this.props.imageURL} width="200" height="300"/> 
      	<p className="anime-detail">{this.props.detail}</p>
      </div>
    );
  }
});
