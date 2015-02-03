/** @jsx React.DOM */
'use strict';
import React from 'react';
import AnimeItemAddComponent from './AnimeItemAdd.react.js';
import AnimeDetailComponent from './AnimeDetail.react.js';

/**
 * @property {string} tab
 * @property {Anime} anime
 * @property {integer,updateparams} update
 */
var AnimeItemComponent = React.createClass({
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
  toggleDescription: function(event) {
    var html = React.renderToString(<AnimeDetailComponent 
      imageURL={this.props.anime.cover_image} 
      detail={this.props.anime.synopsis}/>);
    $(this.refs.title.getDOMNode()).popover({
      placement: 'bottom',
      html: true,
      content: html
    });
  },
  render: function() {
    return (
      <div>
        <li className="list-group-item" >
          <AnimeItemAddComponent anime={this.props.anime} onClicked={this.onAdd}/>
          <span>{'\u00a0'}</span>
          <span>{'\u00a0'}</span>
          <div className="spacer"></div>
          <h1 className="episode">
            _/{this.props.anime.episode_count}
          </h1>
          <h2 className="anime-title" ref="title" onMouseEnter={this.toggleDescription}>{this.props.anime.title}</h2>
        </li>
      </div>
    );
  }
});

export default AnimeItemComponent;
