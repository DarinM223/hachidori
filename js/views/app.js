/** @jsx React.DOM */
'use strict';

import React from 'react';
import AnimeCache from '../AnimeCache.js';
import HummingbirdAccessToken from '../HummingbirdAccessToken.js';
import HummingbirdAnimeList from '../HummingbirdAnimeList.js';
import LoginPageComponent from './LoginPage.react.js';
import AnimeTabBarComponent from './AnimeTabBar.react.js';
import AnimeSearchComponent from './AnimeSearch.react.js';
import AnimeListComponent from './AnimeList.react.js';
import LocalStorage from '../LocalStorage.js';

var access_token = new HummingbirdAccessToken();
var searchTimeoutID = null;

var App = React.createClass({
  getInitialState: function() {
    LocalStorage.init().then(() => {
      if (typeof(access_token.getUsername()) !== 'undefined' && typeof(access_token.getAccessToken()) !== 'undefined' && 
          access_token.getUsername() !== null && access_token.getAccessToken() !== null) {
        console.log(access_token.getUsername());
        this.setState({ loggedIn: true });
      }
    }).catch((e) => { throw e; });

    return {
      filterText: '',
      tab: 'currently-watching',
      loggedIn: false, 
      searchAnime: []
    };
  },

  /**
   * Search the Hummingbird API for anime with the state's filterText
   */
  searchAnime: async function() {
    var newAnimeList = [];
    var data = await HummingbirdAnimeList.search(this.state.filterText);

    for (var i = 0; i < data.length; i++) {
      if (!AnimeCache.inCache(data[i].id)) {
        newAnimeList.push(data[i]);
      }
    }
    this.setState({ searchAnime: newAnimeList });
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

  onLogin: async function(username, password) {
    try {
      await access_token.authenticate(username, password);
      this.setState({ loggedIn: true });
    } catch (e) {
      console.log(e);
      throw e;
    }
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
    console.log(this.state.loggedIn);
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

export default App;

