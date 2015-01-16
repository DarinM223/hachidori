/** @jsx React.DOM */
'use strict';

/**
 * @property {function(string} onTabChanged
 */
var AnimeTabBarComponent = React.createClass({displayName: 'AnimeTabBarComponent',
  getInitialState: function() {
    return {
      tab: 'currently-watching'
    };
  },
  onTabChanged: function(newTab) {
    this.setState({ tab: newTab }, function() {
      this.props.onTabChanged(newTab);
    });
  },
  render: function() {
    var tabbarClass = 'tabbar-item';
    var allStr               = tabbarClass + (this.state.tab === 'all' ? ' active' : '');
    var currentlyWatchingStr = tabbarClass + (this.state.tab === 'currently-watching' ? ' active' : '');
    var planToWatchStr       = tabbarClass + (this.state.tab === 'plan-to-watch' ? ' active' : '');
    var completedStr         = tabbarClass + (this.state.tab === 'completed' ? ' active' : '');
    var onHoldStr            = tabbarClass + (this.state.tab === 'on-hold' ? ' active' : '');
    var droppedStr           = tabbarClass + (this.state.tab === 'dropped' ? ' active' : '');

    return (
      React.createElement("section", {id: "tool-bar"}, 
          React.createElement("ul", {className: "nav nav-tabs"}, 
            React.createElement("li", {className: allStr}, 
              React.createElement("a", {id: "all", href: "#", 'data-toggle': "tab", onClick: this.onTabChanged.bind(this,'all')}, 
                "All"
              )
            ), 
            React.createElement("li", {className: currentlyWatchingStr}, 
              React.createElement("a", {id: "currently-watching", href: "#", 'data-toggle': "tab", onClick: this.onTabChanged.bind(this,'currently-watching')}, 
                "Currently Watching"
              )
            ), 
            React.createElement("li", {className: planToWatchStr}, 
              React.createElement("a", {id: "plan-to-watch", href: "#", 'data-toggle': "tab", onClick: this.onTabChanged.bind(this,'plan-to-watch')}, 
                "Plan to Watch"
              )
            ), 
            React.createElement("li", {className: completedStr}, 
              React.createElement("a", {id: "completed", href: "#", 'data-toggle': "tab", onClick: this.onTabChanged.bind(this,'completed')}, 
                "Completed"
              )
            ), 
            React.createElement("li", {className: onHoldStr}, 
              React.createElement("a", {id: "on-hold", href: "#", 'data-toggle': "tab", onClick: this.onTabChanged.bind(this,'on-hold')}, 
                "On Hold"
              )
            ), 
            React.createElement("li", {className: droppedStr}, 
              React.createElement("a", {id: "dropped", href: "#", 'data-toggle': "tab", onClick: this.onTabChanged.bind(this,'dropped')}, 
                "Dropped"
              )
            )
          )
      )
    );
  }
});
