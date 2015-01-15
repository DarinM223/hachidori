/** @jsx React.DOM */
'use strict';

var access_token = new HummingbirdAccessToken();
var searchTimeoutID = null;

var App = React.createClass({
  getInitialState: function() {
    var loggedIn = true;
    if (access_token.getUsername() === null || access_token.getAccessToken() === null) {
      loggedIn = false;
    }
    return {
      filterText: '',
      tab: 'currently-watching',
      loggedIn: loggedIn, 
      searchAnime: []
    };
  },
  searchAnime: function() {
    var newAnimeList = [];
    HummingbirdAnimeList.search(this.state.filterText, function(err, data) {
      for (var i = 0; i < data.length; i++) {
        if (!AnimeCache.inCache(data[i].id)) {
          newAnimeList.push(data[i]);
        }
      }
      this.setState({ searchAnime: newAnimeList });
    }.bind(this));
  },
  onTextChanged: function(filterText) {
    this.setState({ filterText: filterText }, function() {
      if (searchTimeoutID === null) {
        searchTimeoutID = window.setTimeout(this.searchAnime, 500);
      } else {
        if (typeof searchTimeoutID == "number") {
          window.clearTimeout(searchTimeoutID);
          searchTimeoutID = window.setTimeout(this.searchAnime, 500);
        }
      }
    });
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
  onLogout: function() {
    access_token.removeAccessToken();
    this.setState({ loggedIn: false });
  },
  signoutStyle: {
    float: 'right'
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
          <a className="btn btn-default" style={this.signoutStyle} onClick={this.onLogout}>Sign out</a>
          <AnimeTabBarComponent onTabChanged={this.onTabChanged}/>
          <AnimeSearchComponent onTextChanged={this.onTextChanged}/>
          <AnimeListComponent username={access_token.getUsername()} 
            filterText={this.state.filterText} 
            tab={this.state.tab}
            searchList={this.state.searchAnime}/>
        </div>
      );
    }
  }
});

