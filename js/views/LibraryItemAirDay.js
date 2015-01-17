/** @jsx React.DOM */
'use strict';

/**
 * @param {LibraryItem} libraryItem
 * @param {function(integer)} onChangeAirDay
 */
var LibraryItemAirDayComponent = React.createClass({displayName: 'LibraryItemAirDayComponent',
  onChangeAirDay: function(dayOfWeek) {
    AnimeAirDate.setAirDate(this.props.libraryItem.anime.id, dayOfWeek);
    this.props.onChangeAirDay(dayOfWeek);
  },
  render: function() {
    var DropdownButton = window.ReactBootstrap.DropdownButton;
    var MenuItem = window.ReactBootstrap.MenuItem;

    var airDate = AnimeAirDate.getAirDate(this.props.libraryItem.anime.id);
    var dateText = null;

    if (airDate == 0) {
        dateText = 'Sunday';
    } else if (airDate == 1) {
        dateText = 'Monday';
    } else if (airDate == 2) {
        dateText = 'Tuesday';
    } else if (airDate == 3) {
        dateText = 'Wednesday';
    } else if (airDate == 4) {
        dateText = 'Thursday';
    } else if (airDate == 5) {
        dateText = 'Friday';
    } else if (airDate == 6) {
        dateText = 'Saturday';
    }

    return (
      React.createElement("span", null, 
        React.createElement("label", {htmlFor: "air-date"}, React.createElement("span", null, '\u00a0'), "Air day:", React.createElement("span", null, '\u00a0')), 
        React.createElement(DropdownButton, {id: "dropdown-status", title: dateText}, 
          React.createElement(MenuItem, {href: "#", onClick: this.onChangeAirDay.bind(null, 0)}, "Sunday"), 
          React.createElement(MenuItem, {href: "#", onClick: this.onChangeAirDay.bind(null, 1)}, "Monday"), 
          React.createElement(MenuItem, {href: "#", onClick: this.onChangeAirDay.bind(null, 2)}, "Tuesday"), 
          React.createElement(MenuItem, {href: "#", onClick: this.onChangeAirDay.bind(null, 3)}, "Wednesday"), 
          React.createElement(MenuItem, {href: "#", onClick: this.onChangeAirDay.bind(null, 4)}, "Thursday"), 
          React.createElement(MenuItem, {href: "#", onClick: this.onChangeAirDay.bind(null, 5)}, "Friday"), 
          React.createElement(MenuItem, {href: "#", onClick: this.onChangeAirDay.bind(null, 6)}, "Saturday")
        )
      )
    );
  }
});
