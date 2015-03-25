/** @jsx React.DOM */
'use strict';

import React from 'react';
import AnimeItemAddComponent from './AnimeItemAdd.react.js';
import LocalStorage from '../LocalStorage.js';
import AnimeItemMixin from './mixins/AnimeItemMixin.react.js';

/**
 * @property {string} tab
 * @property {Anime} anime
 * @property {integer,updateparams} update
 */
var AnimeItemComponent = React.createClass({
  mixins: [AnimeItemMixin],

  onAdd: function() {
    var tab = this.props.tab;
    if (tab === 'all') {
      tab = 'currently-watching';
    }
    this.props.update(this.props.anime.id, {
      status: tab,
      privacy: 'public'
    });
  },

  render: function() {
    return (
      <div onMouseEnter={this.titleHover.bind(this, this.props.anime) }>
        <li className="list-group-item">
          <AnimeItemAddComponent anime={this.props.anime} onClicked={this.onAdd}/>
          &nbsp;&nbsp;
          <div className="spacer"></div>
          <h1 className="episode">
            _/{this.props.anime.episode_count}
          </h1>
          <h2 className="anime-title" ref="title" 
              onMouseDown={this.toggleDescription.bind(this, this.props.anime) }>
              {this.props.anime.title}
          </h2>
        </li>
      </div>
    );
  }
});

export default AnimeItemComponent;
