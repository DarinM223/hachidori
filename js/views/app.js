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

var PAGINATION_LIMIT = 10;

var App = React.createClass({
  getInitialState: function() {
    var loggedIn = false;

    LocalStorage.init().then(() => {
      if (typeof(access_token.getUsername()) !== 'undefined' && typeof(access_token.getAccessToken()) !== 'undefined' && 
          access_token.getUsername() !== null && access_token.getAccessToken() !== null) {
        this.setState({ loggedIn: true });
      }
    }).catch((e) => { throw e; });

    return {
      filterText: '',
      tab: 'currently-watching',
      loggedIn: loggedIn, 
      searchAnime: [],
      err: null,
      maxLibraryItems: PAGINATION_LIMIT,
      itemIncrement: PAGINATION_LIMIT
    };
  },

  /**
   * Search the Hummingbird API for anime with the state's filterText
   */
  searchAnime: function() {
    if (this.state.filterText.trim() !== '') {
      return HummingbirdAnimeList.search(this.state.filterText).then((data) => {
        var newAnimeList = [];
        for (var i = 0; i < data.length; i++) {
          if (!AnimeCache.inCache(data[i].id)) {
            newAnimeList.push(data[i]);
          }
        }
        this.setState({ searchAnime: newAnimeList });
      });
    } else {
      this.setState({ searchAnime: [] });
      return Promise.resolve();
    }
  },

  onTextChanged: function(filterText) {
    if (filterText.trim() !== '') {
      this.setState({ filterText: filterText.trim() }, function() {
        if (searchTimeoutID === null) {
          searchTimeoutID = window.setTimeout(this.searchAnime, 500);
        } else {
          if (typeof searchTimeoutID == "number") {
            window.clearTimeout(searchTimeoutID);
            searchTimeoutID = window.setTimeout(this.searchAnime, 500);
          }
        }
      });
    } else {
      this.setState({ filterText: filterText.trim(), searchAnime: [] }); // clear search list if text is empty
    }
  },

  onTabChanged: function(newTab) {
    this.setState({ tab: newTab, maxLibraryItems: PAGINATION_LIMIT });
  },

  onLogin: function(username, password) {
    access_token.authenticate(username, password).then(() => {
      this.setState({ loggedIn: true });
    }).catch((e) => {
      this.setState({ err: e });
    });
  },

  onLogout: function() {
    access_token.removeAccessToken();
    this.replaceState(this.getInitialState());
  },

  onReload: function() {
    if (this.state.loggedIn) {
      // if logged in save some previous state variables before reloading
      var lastTab = this.state.tab;

      var state = this.getInitialState();
      state.tab = lastTab;
      this.replaceState(state);
    } else {
      this.replaceState(this.getInitialState());
    }
  },

  signoutStyle: {
    float: 'right'
  },

  fixedStyle: {
    position: 'fixed',
    width: '100%',
    backgroundColor: 'white',
    zIndex: '99999'
  },

  onMoreClicked: function() {
    this.setState({ maxLibraryItems: this.state.maxLibraryItems + this.state.itemIncrement });
  },

  render: function() {
    var answer = null;

    if (!this.state.loggedIn) {
      if (this.state.err) {
        return (
          <div>
            <LoginPageComponent onLogin={this.onLogin}/>
            <p className='error'>{this.state.err + ''}</p>
          </div>
        );
      } else {
        return (
          <LoginPageComponent onLogin={this.onLogin}/>
        );
      }
    } else {
      return (
        <div>
          <div style={this.fixedStyle}>
            <span style={this.signoutStyle}>
              <a className="btn btn-default" onClick={this.onReload}><span className="glyphicon glyphicon-refresh"/></a>
              <a className="btn btn-default" onClick={this.onLogout}>Sign out</a>
            </span>
            <AnimeTabBarComponent onTabChanged={this.onTabChanged} tab={this.state.tab}/>
            <AnimeSearchComponent onTextChanged={this.onTextChanged}/>
          </div>
          <br/>
          <br/>
          <br/>
          <br/>

          <AnimeListComponent username={access_token.getUsername()} 
            filterText={this.state.filterText} 
            tab={this.state.tab}
            searchList={this.state.searchAnime}
            maxLibraryItems={this.state.maxLibraryItems}
            itemIncrement={this.state.itemIncrement}
            onMoreClicked={this.onMoreClicked}/>
        </div>
      );
    }
  }
});

export default App;

