'use strict';

var React = require('react')
  , LocalStorage = require('../../LocalStorage.js')
  , AnimeDetailComponent = require('../AnimeDetail.react.js');

/**
 * Mixin for Anime description popup 
 * @property {refs} title the title ref element in the component using the mixin
 */
var AnimeMixin = {
  toggleDescription: function(anime) {
    var html;

    if (LocalStorage.isChromeExtension) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', anime.cover_image, true);
      xhr.responseType = 'blob';

      xhr.onload = (e) => {
        html = React.renderToString(<AnimeDetailComponent 
          title={anime.title}
          imageURL={ window.URL.createObjectURL(xhr.response) }
          detail={anime.synopsis}/>);
        this.displayPopup(html);
      };

      xhr.send();
    } else {
      html = React.renderToString(<AnimeDetailComponent 
        title={anime.title}
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

module.exports = AnimeMixin;
