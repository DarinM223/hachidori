'use strict';
import React from 'react';
import LocalStorage from '../../LocalStorage.js';
import AnimeDetailComponent from '../AnimeDetail.react.js';
import AnimeImageCache from '../../AnimeImageCache.js';

/**
 * Mixin for Anime description popup 
 * @property {refs} title the title ref element in the component using the mixin
 */
var AnimeItemMixin = {
  titleHover: function(anime) {
    var that = this;
    if (LocalStorage.isChromeExtension) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', anime.cover_image, true);
      xhr.responseType = 'blob';

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          var url = window.URL.createObjectURL(xhr.response);
          AnimeImageCache.set(anime.id+'', url);
          var html = React.renderToString(<AnimeDetailComponent imageURL={ url } detail={ anime.synopsis }/>);
          that.displayPopup(html);
        }
      };

      xhr.timeout = 500; // 500 millisecond timeout

      xhr.send();
    }
  },

  toggleDescription: function(anime) {
    var that = this;
    if (LocalStorage.isChromeExtension) {
      if (AnimeImageCache.inCache(anime.id+'')) {
        var url = AnimeImageCache.get(anime.id+'');
        var html = React.renderToString(<AnimeDetailComponent imageURL={ url } detail={ anime.synopsis }/>);
        this.displayPopup(html);
      } else {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', anime.cover_image, true);
        xhr.responseType = 'blob';

        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            var url = window.URL.createObjectURL(xhr.response);
            AnimeImageCache.set(anime.id+'', url);
            var html = React.renderToString(<AnimeDetailComponent imageURL={ url } detail={ anime.synopsis }/>);
            that.displayPopup(html);
          }
        };

        xhr.onerror = function(e) {
          var html = React.renderToString(<AnimeDetailComponent imageURL={ null } detail={ anime.synopsis }/>);
          that.displayPopup(html);
        };

        xhr.ontimeout = function(e) {
          var html = React.renderToString(<AnimeDetailComponent imageURL={ null } detail={ anime.synopsis }/>);
          that.displayPopup(html);
        };

        xhr.timeout = 1000; // 1000 millisecond timeout

        xhr.send();
      }
    } else {
      var html = React.renderToString(<AnimeDetailComponent imageURL={ anime.cover_image } detail={ anime.synopsis }/>);
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
