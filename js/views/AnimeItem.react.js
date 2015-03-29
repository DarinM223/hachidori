/** @jsx React.DOM */
'use strict';

var React = require('react')
  , AnimeItemAddComponent = require('./AnimeItemAdd.react.js')
  , LocalStorage = require('../LocalStorage.js')
  , AnimeMixin = require('./mixins/AnimeMixin.js')
  , AnimeItemMixin = require('./mixins/AnimeItemMixin.js');

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

module.exports = AnimeItemComponent;
