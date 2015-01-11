'use strict';

var App = React.createClass({
  getInitialState: function() {
    return {
      filterText: '',
      tab: 'currently-watching'
    };
  },
  onTextChanged: function(filterText) {
    this.setState({ filterText: filterText });
  },
  onTabChanged: function(newTab) {
    this.setState({ tab: newTab });
  },
  render: function() {
    return (
      <div>
        <AnimeTabBarComponent onTabChanged={this.onTabChanged}/>
        <AnimeSearchComponent onTextChanged={this.onTextChanged}/>
        <AnimeListComponent username={"darin_minamoto"} filterText={this.state.filterText} tab={this.state.tab}/>
      </div>
    );
  }
});

