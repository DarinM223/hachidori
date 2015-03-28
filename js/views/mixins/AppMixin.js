'use strict';

import AnimeCache from '../../AnimeCache.js';
import HummingbirdAccessToken from '../../HummingbirdAccessToken.js';
import HummingbirdAnimeList from '../../HummingbirdAnimeList.js';
import LocalStorage from '../../LocalStorage.js';

var AppMixin = {
  access_token: new HummingbirdAccessToken(),
  searchTimeoutID: null,
  PAGINATION_LIMIT: 10,

  getInitialState: function() {
    var loggedIn = false;

    LocalStorage.init().then(() => {
      if (typeof(this.access_token.getUsername()) !== 'undefined' && typeof(this.access_token.getAccessToken()) !== 'undefined' && 
          this.access_token.getUsername() !== null && this.access_token.getAccessToken() !== null) {
        this.setState({ loggedIn: true });
      }
    }).catch((e) => { throw e; });

    return {
      filterText: '',
      tab: 'currently-watching',
      loggedIn: loggedIn, 
      searchAnime: [],
      err: null,
      maxLibraryItems: this.PAGINATION_LIMIT,
      itemIncrement: this.PAGINATION_LIMIT
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
      this.setState({ filterText: filterText.trim() }, () => {
        if (this.searchTimeoutID === null) {
          this.searchTimeoutID = window.setTimeout(this.searchAnime, 500);
        } else {
          if (typeof this.searchTimeoutID == "number") {
            window.clearTimeout(this.searchTimeoutID);
            this.searchTimeoutID = window.setTimeout(this.searchAnime, 500);
          }
        }
      });
    } else {
      this.setState({ filterText: filterText.trim(), searchAnime: [] }); // clear search list if text is empty
    }
  },

  onTabChanged: function(newTab) {
    this.setState({ tab: newTab, maxLibraryItems: this.PAGINATION_LIMIT });
  },

  onLogin: function(username, password) {
    this.access_token.authenticate(username, password).then(() => {
      this.setState({ loggedIn: true });
    }).catch((e) => {
      this.setState({ err: e });
    });
  },

  onLogout: function() {
    this.access_token.removeAccessToken();
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

  onMoreClicked: function() {
    this.setState({ maxLibraryItems: this.state.maxLibraryItems + this.state.itemIncrement });
  }
};

export default AppMixin;
