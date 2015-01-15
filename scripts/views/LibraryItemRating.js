/** @jsx React.DOM */
'use strict';

/**
 * @property {LibraryItem} libraryItem
 * @property {function(double)} onChangeRating
 */
var LibraryItemRatingComponent = React.createClass({
  onChangeRating: function(newRating) {
    if (newRating !== this.props.libraryItem.rating.value) {
      this.props.onChangeRating(newRating);
    }
  },
  componentDidMount: function() {
    $(this.refs.rating.getDOMNode()).rateit();
    $(this.refs.rating.getDOMNode()).bind('rated', function(event, value) {
      this.onChangeRating(value);
    }.bind(this));
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
