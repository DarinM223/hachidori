'use strict';
import React from 'react';
import LocalStorage from '../../LocalStorage.js';
import AnimeDetailComponent from '../AnimeDetail.react.js';

/**
 * Mixin for Anime description popup 
 * @property {refs} title the title ref element in the component using the mixin
 */
var AnimeItemMixin = {
  toggleDescription: function(anime) {
    var html;

    if (LocalStorage.isChromeExtension) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', anime.cover_image, true);
      xhr.responseType = 'blob';

      xhr.onload = (e) => {
        html = React.renderToString(<AnimeDetailComponent 
          imageURL={ window.URL.createObjectURL(xhr.response) }
          detail={anime.synopsis}/>);
        this.displayPopup(html);
      };

      xhr.send();
    } else {
      html = React.renderToString(<AnimeDetailComponent 
        imageURL={anime.cover_image} 
        detail={anime.synopsis}/>);
      this.displayPopup(html);
    }
  },

  displayPopup: function(html) {
    window.$(this.refs.title.getDOMNode()).popover({
      placement: 'bottom',
      html: true,
      container: 'body',
      content: html
    });
  },

  componentWillUnmount: function() {
    window.$(this.refs.title.getDOMNode()).popover('hide');
  }
};

export default AnimeItemMixin;
