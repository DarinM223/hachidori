/** @jsx React.DOM */
'use strict';

import React from 'react';

/**
 * @property {imageURL} 
 * @property {detail}
 */
var AnimeDetailComponent = React.createClass({
  render: function() {
    if (this.props.imageURL !== null) {
      return (
        <div className="anime-detail-container"> 
          <img className="anime-cover-image" src={this.props.imageURL} /> 
          <p className="anime-detail">{this.props.detail}</p>
        </div>
      );
    } else {
      return (
        <div className="anime-detail-container"> 
          <p className="anime-detail">{this.props.detail}</p>
        </div>
      );
    }
  }
});

export default AnimeDetailComponent;
