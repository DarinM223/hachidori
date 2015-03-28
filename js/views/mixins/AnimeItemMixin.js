'use strict';

/**
 * @property {string} tab
 * @property {Anime} anime
 * @property {integer,updateparams} update
 */
var AnimeItemMixin = {
  onAdd: function() {
    var tab = this.props.tab;
    if (tab === 'all') {
      tab = 'currently-watching';
    }
    this.props.update(this.props.anime.id, {
      status: tab,
      privacy: 'public'
    });
  }
};

export default AnimeItemMixin;
