'use strict';

var access_token = new HummingbirdAccessToken();

var App = React.createClass({
  getInitialState: function() {
    var loggedIn = true;
    if (access_token.getUsername() === null || access_token.getAccessToken() === null) {
      loggedIn = false;
    }
    return {
      filterText: '',
      tab: 'currently-watching',
      loggedIn: loggedIn
    };
  },
  onTextChanged: function(filterText) {
    this.setState({ filterText: filterText });
  },
  onTabChanged: function(newTab) {
    this.setState({ tab: newTab });
  },
  onLogin: function(username, password) {
    access_token.authenticate(username, password, function(err) {
      if (!err) {
        this.setState({ loggedIn: true });
      } else {
        alert('Error logging in');
      }
    }.bind(this));
  },
  render: function() {
    var answer = null;
    if (!this.state.loggedIn) {
      return (
        <LoginPageComponent onLogin={this.onLogin}/>
      )
    } else {
      return (
        <div>
          <AnimeTabBarComponent onTabChanged={this.onTabChanged}/>
          <AnimeSearchComponent onTextChanged={this.onTextChanged}/>
          <AnimeListComponent username={access_token.getUsername()} filterText={this.state.filterText} tab={this.state.tab}/>
        </div>
      );
    }
  }
});

