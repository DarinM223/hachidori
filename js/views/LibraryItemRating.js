/** @jsx React.DOM */
'use strict';

/**
 * @property {LibraryItem} libraryItem
 * @property {function(double)} onChangeRating
 */
var LibraryItemRatingComponent = React.createClass({displayName: 'LibraryItemRatingComponent',
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
        React.createElement("span", null, 
          React.createElement("label", {htmlFor: "rating"}, "Rating: ", React.createElement("span", null, '\u00a0')), 
          React.createElement("select", {id: "backing-" + this.props.libraryItem.anime.id, name: "Rating"}, 
            React.createElement("option", {value: "1"}), 
            React.createElement("option", {value: "1.5"}), 
            React.createElement("option", {value: "2"}), 
            React.createElement("option", {value: "2.5"}), 
            React.createElement("option", {value: "3"}), 
            React.createElement("option", {value: "3.5"}), 
            React.createElement("option", {value: "4"}), 
            React.createElement("option", {value: "4.5"}), 
            React.createElement("option", {value: "5"})
          ), 
          React.createElement("span", {ref: "rating", 'data-rateit-backingfld': "select#backing-" + this.props.libraryItem.anime.id, 
               'data-rateit-resetable': "false", 'data-rateit-value': this.props.libraryItem.rating.value})
        )
      );
    } else {
      return (
        React.createElement("p", null, "No rating for smileys")
      );
    }
  }
});
