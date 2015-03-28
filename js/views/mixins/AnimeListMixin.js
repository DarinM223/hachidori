'use strict';

import React from 'react/addons';
import AnimeCache from '../../AnimeCache.js';
import HummingbirdAnimeList from '../../HummingbirdAnimeList.js';

/**
 * @property {string} username
 * @state {Array<LibraryItem>} animelist
 * @state {boolean} loading
 */
var AnimeListMixin = {
  getInitialState: function() {
    this.HummingbirdApi = new HummingbirdAnimeList(this.props.username, () => {
      var library = this.HummingbirdApi.getList();
      for (var i = 0; i < library.length; i++) {
        AnimeCache.addAnime(library[i].anime.id);
      }
      this.setState({ loading: false, animelist: this.HummingbirdApi.getList() });
    }, (err) => console.log(err));

    return {
      loading: true,
      animelist: null
    };
  },

  /**
   * Returns the index of an anime in the animelist
   * @param {integer} animeid the id of the anime to find
   * @return {integer} the index of the anime in the animelist or -1 if anime is not in the list
   */
  getLibraryIndex: function(animeid) {
    var libraryIndex = -1;
    for (var i = 0; i < this.state.animelist.length; i++) {
      if (animeid === this.state.animelist[i].anime.id) {
        libraryIndex = i;
        break;
      }
    }
    return libraryIndex;
  },

  /**
   * Adds/updates library items to the animelist
   * @param {integer} animeid the id of the anime to update/add
   * @param {Object} updateparams the parameters to pass through the api
   */
  update: function(animeid, updateparams) {
    return HummingbirdAnimeList.update(animeid, updateparams).then((libraryItem) => {
      var libraryIndex = this.getLibraryIndex(animeid);
      if (libraryIndex !== -1) { // set existing anime
        var changeOptions = {};
        changeOptions[libraryIndex] = {
          $set: libraryItem
        };
        var newlist = React.addons.update(this.state.animelist, changeOptions);
        this.setState({ animelist: newlist });
      } else { // add new anime
        var newlist = React.addons.update(this.state.animelist, { $push: [libraryItem] });
        AnimeCache.addAnime(animeid);
        this.setState({ animelist: newlist });
      }
    });
  },

  /**
   * Removes library items from the animelist
   * @param {integer} animeid the id of the anime to remove
   */
  remove: function(animeid) {
    return HummingbirdAnimeList.removeFromList(animeid).then(() => {
      var libraryIndex = this.getLibraryIndex(animeid);

      if (libraryIndex !== -1) {
        var newlist = React.addons.update(this.state.animelist, { $splice: [[libraryIndex, 1]] });
        AnimeCache.removeAnime(animeid);
        this.setState({ animelist: newlist });
      } else {
        throw new Error('Removed item is not in the library');
      }
    });
  },

  onAirDayChanged: function(newDay) {
    this.forceUpdate();
  }
};

export default AnimeListMixin;
