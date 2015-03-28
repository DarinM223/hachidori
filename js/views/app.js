/** @jsx React.DOM */
'use strict';

import React from 'react';
import LoginPageComponent from './LoginPage.react.js';
import AnimeTabBarComponent from './AnimeTabBar.react.js';
import AnimeSearchComponent from './AnimeSearch.react.js';
import AnimeListComponent from './AnimeList.react.js';
import AppMixin from './mixins/AppMixin.js';

var App = React.createClass({
  mixins: [AppMixin],

  signoutStyle: {
    float: 'right'
  },

  fixedStyle: {
    position: 'fixed',
    width: '100%',
    backgroundColor: 'white',
    zIndex: '99999'
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

          <AnimeListComponent username={this.access_token.getUsername()} 
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

