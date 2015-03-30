/** @jsx React.DOM */
'use strict';

var React = require('react');

/**
 * @property {function(this)} onTextChanged
 */
var AnimeSearchComponent = React.createClass({
  onTextChanged: function(event) {
    this.props.onTextChanged(event.target.value);
  },

  onClicked: function() {
    this.refs.search.getDOMNode().value = '';
    this.props.onTextChanged('');
  },

  render: function() {
    return (
      <div className="input-group">
        <input type="text" className="form-control" placeholder="Search your anime list" ref="search"
               onChange={this.onTextChanged}/>
        <span className="input-group-btn">
          <input type="button" className="btn btn-default" value="Clear" onClick={this.onClicked}/>
        </span>
      </div>
    );
  }
});

module.exports = AnimeSearchComponent;
