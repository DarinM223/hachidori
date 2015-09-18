'use strict';

var React = require('react')
  , ReactBootstrap = require('react-bootstrap')
  , LibraryItemStatusMixin = require('./mixins/LibraryItemStatusMixin.js');

/**
 * @property {LibraryItem} libraryItem
 * @property {function(string)} onChangeStatus
 * @property {function()} removeFromLibrary
 */
var LibraryItemStatusComponent = React.createClass({
  mixins: [LibraryItemStatusMixin],

  statusMap: {
    'currently-watching': 'Currently Watching',
    'plan-to-watch': 'Plan to Watch',
    'completed': 'Completed',
    'on-hold': 'On Hold',
    'dropped': 'Dropped',
    'remove': 'Remove from Library'
  },

  render: function() {
    var DropdownButton = ReactBootstrap.DropdownButton;
    var MenuItem = ReactBootstrap.MenuItem;

    var statusText = this.statusMap[this.props.libraryItem.status];

    return (
      <span>
        <br/>
        <label htmlFor="dropdown-status">&nbsp; Status: &nbsp;&nbsp;</label>
        <DropdownButton id="dropdown-status" title={statusText} onSelect={this.onSelected}>
          <MenuItem href="#" onClick={this.onChangeStatus.bind(null, 'currently-watching')}>Currently watching</MenuItem>
          <MenuItem href="#" onClick={this.onChangeStatus.bind(null, 'completed')}>Completed</MenuItem>
          <MenuItem href="#" onClick={this.onChangeStatus.bind(null, 'plan-to-watch')}>Plan to Watch</MenuItem>
          <MenuItem href="#" onClick={this.onChangeStatus.bind(null, 'on-hold')}>On Hold</MenuItem>
          <MenuItem href="#" onClick={this.onChangeStatus.bind(null, 'dropped')}>Dropped</MenuItem>
          <MenuItem href="#" onClick={this.removeFromLibrary}>Remove from Library</MenuItem>
        </DropdownButton>
        &nbsp;
      </span>
    );
  }
});

module.exports = LibraryItemStatusComponent;
