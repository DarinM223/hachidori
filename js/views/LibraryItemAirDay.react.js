'use strict';

var React = require('react')
  , ReactBootstrap = require('react-bootstrap')
  , AnimeAirDate = require('../AnimeAirDate.js')
  , LibraryItemAirDayMixin = require('./mixins/LibraryItemAirDayMixin.js');

/**
 * @param {LibraryItem} libraryItem
 * @param {function(integer)} onChangeAirDay
 */
var LibraryItemAirDayComponent = React.createClass({
  mixins: [LibraryItemAirDayMixin],

  render: function() {
    var DropdownButton = ReactBootstrap.DropdownButton;
    var MenuItem = ReactBootstrap.MenuItem;

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
    } else {
      dateText = 'No air day';
    }

    return (
      <span>
        <label htmlFor="air-date"><span>{'\u00a0'}</span>Air day:<span>{'\u00a0'}</span></label>
        <DropdownButton id="dropdown-status" title={dateText}>
          <MenuItem href="#" onClick={this.onChangeAirDay.bind(null, 0)}>Sunday</MenuItem>
          <MenuItem href="#" onClick={this.onChangeAirDay.bind(null, 1)}>Monday</MenuItem>
          <MenuItem href="#" onClick={this.onChangeAirDay.bind(null, 2)}>Tuesday</MenuItem>
          <MenuItem href="#" onClick={this.onChangeAirDay.bind(null, 3)}>Wednesday</MenuItem>
          <MenuItem href="#" onClick={this.onChangeAirDay.bind(null, 4)}>Thursday</MenuItem>
          <MenuItem href="#" onClick={this.onChangeAirDay.bind(null, 5)}>Friday</MenuItem>
          <MenuItem href="#" onClick={this.onChangeAirDay.bind(null, 6)}>Saturday</MenuItem>
        </DropdownButton>
      </span>
    );
  }
});

module.exports = LibraryItemAirDayComponent;
