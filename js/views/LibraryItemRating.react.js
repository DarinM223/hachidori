/** @jsx React.DOM */
'use strict';

import React from 'react';
import $ from 'jquery';
import LibraryItemRatingMixin from './mixins/LibraryItemRatingMixin.js';

/**
 * @property {LibraryItem} libraryItem
 * @property {function(double)} onChangeRating
 */
var LibraryItemRatingComponent = React.createClass({
  mixins: [LibraryItemRatingMixin],

  /**
   * Loads the rateit jquery plugin and calls event whenever the rating is changed
   */
  componentDidMount: function() {
    window.$(this.refs.rating.getDOMNode()).rateit();
    window.$(this.refs.rating.getDOMNode()).bind('rated', (event, value) => {
      this.onChangeRating(value);
    });
  },

  render: function() {
    if (this.props.libraryItem.rating.type === 'advanced') {
      return (
        <span>
          <label htmlFor="rating">Rating: <span>{'\u00a0'}</span></label>
          <select id={"backing-" + this.props.libraryItem.anime.id} name="Rating">
            <option value="1"></option>
            <option value="1.5"></option>
            <option value="2"></option>
            <option value="2.5"></option>
            <option value="3"></option>
            <option value="3.5"></option>
            <option value="4"></option>
            <option value="4.5"></option>
            <option value="5"></option>
          </select>
          <span ref="rating" data-rateit-backingfld={"select#backing-" + this.props.libraryItem.anime.id} 
                data-rateit-resetable="false" data-rateit-value={this.props.libraryItem.rating.value}/>
        </span>
      );
    } else {
      return (
        <p>No rating for smileys</p>
      );
    }
  }
});

export default LibraryItemRatingComponent;
