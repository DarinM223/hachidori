'use strict';

var App = React.createClass({
  getInitialState: function() {
    return {
      filterText: ''
    };
  },
  onTextChanged: function(filterText) {
    var _this = this;
    this.setState({ filterText: filterText });
  },
  render: function() {
    return (
      <div>
        <AnimeSearchComponent onTextChanged={this.onTextChanged}/>
        <AnimeListComponent data={fixture_data} filterText={this.state.filterText}/>
      </div>
    );
  }
});

