/** @jsx React.DOM */
'use strict';

/**
 * @property {LibraryItem} libraryItem
 * @property {function(string)} onChangeStatus
 * @property {function()} removeFromLibrary
 */
var LibraryItemStatusComponent = React.createClass({displayName: 'LibraryItemStatusComponent',
  onChangeStatus: function(newStatus) {
    this.props.onChangeStatus(newStatus);
  },
  removeFromLibrary: function() {
    this.props.removeFromLibrary();
  },
  render: function() {
    var DropdownButton = window.ReactBootstrap.DropdownButton;
    var MenuItem = window.ReactBootstrap.MenuItem;

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
      React.createElement("span", null, 
        React.createElement("br", null), 
        React.createElement("label", {htmlFor: "dropdown-status"}, "Status: ", React.createElement("span", null, '\u00a0')), 
        React.createElement(DropdownButton, {id: "dropdown-status", title: statusText}, 
          React.createElement(MenuItem, {href: "#", onClick: this.onChangeStatus.bind(null, 'currently-watching')}, "Currently watching"), 
          React.createElement(MenuItem, {href: "#", onClick: this.onChangeStatus.bind(null, 'completed')}, "Completed"), 
          React.createElement(MenuItem, {href: "#", onClick: this.onChangeStatus.bind(null, 'plan-to-watch')}, "Plan to Watch"), 
          React.createElement(MenuItem, {href: "#", onClick: this.onChangeStatus.bind(null, 'on-hold')}, "On Hold"), 
          React.createElement(MenuItem, {href: "#", onClick: this.onChangeStatus.bind(null, 'dropped')}, "Dropped"), 
          React.createElement(MenuItem, {href: "#", onClick: this.removeFromLibrary}, "Remove from Library")
        ), 
        React.createElement("span", null, '\u00a0')
      )
    );
  }
});
