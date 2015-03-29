/** @jsx React.DOM */
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

  render: function() {
    var DropdownButton = ReactBootstrap.DropdownButton;
    var MenuItem = ReactBootstrap.MenuItem;

    var statusText = "";
    switch (this.props.libraryItem.status) {
      case 'currently-watching':
        statusText = 'Currently Watching';
        break;
      case 'plan-to-watch':
        statusText = 'Plan to Watch';
        break;
      case 'completed':
        statusText = 'Completed';
        break;
      case 'on-hold':
        statusText = 'On Hold';
        break;
      case 'dropped':
        statusText = 'Dropped';
        break;
    }

    return (
      <span>
        <br/>
        <label htmlFor="dropdown-status">Status: &nbsp;</label>
        <DropdownButton id="dropdown-status" title={statusText}>
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
