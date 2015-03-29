/** @jsx React.DOM */
'use strict';

var React = require('react');

/**
 * @property {function(string} onTabChanged
   @property {string} tab
 */
var AnimeTabBarComponent = React.createClass({
  onTabChanged: function(newTab) {
    this.props.onTabChanged(newTab);
  },

  render: function() {
    var tabbarClass = 'tabbar-item';
    var allStr               = tabbarClass + (this.props.tab === 'all' ? ' active' : '');
    var currentlyWatchingStr = tabbarClass + (this.props.tab === 'currently-watching' ? ' active' : '');
    var planToWatchStr       = tabbarClass + (this.props.tab === 'plan-to-watch' ? ' active' : '');
    var completedStr         = tabbarClass + (this.props.tab === 'completed' ? ' active' : '');
    var onHoldStr            = tabbarClass + (this.props.tab === 'on-hold' ? ' active' : '');
    var droppedStr           = tabbarClass + (this.props.tab === 'dropped' ? ' active' : '');

    return (
      <section id="tool-bar">
          <ul className="nav nav-tabs">
            <li className={allStr}> 
              <a id="all" href="#" data-toggle="tab" onClick={this.onTabChanged.bind(this,'all')}>
                All
              </a>
            </li>
            <li className={currentlyWatchingStr}>
              <a id="currently-watching" href="#" data-toggle="tab" onClick={this.onTabChanged.bind(this,'currently-watching')}>
                Currently Watching
              </a>
            </li>
            <li className={planToWatchStr}>
              <a id="plan-to-watch" href="#" data-toggle="tab" onClick={this.onTabChanged.bind(this,'plan-to-watch')}>
                Plan to Watch
              </a>
            </li>
            <li className={completedStr}>
              <a id="completed" href="#" data-toggle="tab" onClick={this.onTabChanged.bind(this,'completed')}>
                Completed
              </a>
            </li>
            <li className={onHoldStr}>
              <a id="on-hold" href="#" data-toggle="tab" onClick={this.onTabChanged.bind(this,'on-hold')}>
                On Hold
              </a>
            </li>
            <li className={droppedStr}>
              <a id="dropped" href="#" data-toggle="tab" onClick={this.onTabChanged.bind(this,'dropped')}>
                Dropped
              </a>
            </li>
          </ul>
      </section>
    );
  }
});

module.exports = AnimeTabBarComponent;
