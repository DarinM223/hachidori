/** @jsx React.DOM */
'use strict';

import React from 'react';
import AnimeItemAddComponent from './AnimeItemAdd.react.js';
import LocalStorage from '../LocalStorage.js';
import AnimeMixin from './mixins/AnimeMixin.js';
import AnimeItemMixin from './mixins/AnimeItemMixin.js';

/**
 * @property {string} tab
 * @property {Anime} anime
 * @property {integer,updateparams} update
 */
var AnimeItemComponent = React.createClass({
  mixins: [AnimeMixin, AnimeItemMixin],

  render: function() {
    return (
      <div>
        <li className="list-group-item" >
          <AnimeItemAddComponent anime={this.props.anime} onClicked={this.onAdd}/>
          &nbsp;&nbsp;
          <div className="spacer"></div>
          <h1 className="episode">
            _/{this.props.anime.episode_count}
          </h1>
          <h2 className="anime-title" ref="title" onMouseDown={this.toggleDescription.bind(this, this.props.anime) }>{this.props.anime.title}</h2>
        </li>
      </div>
    );
  }
});

export default AnimeItemComponent;
