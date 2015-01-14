'use strict';

/**
 * @property {Anime} anime
 * @property {this,updateparams} update
 */
var AnimeItemComponent = React.createClass({
  onAdd: function() {
    this.props.update(this.props.anime.id, {
      status: 'currently-watching',
      privacy: 'public'
    });
  },
  render: function() {
    return (
      <div>
        <li className="list-group-item" >
          <AnimeItemAddComponent anime={this.props.anime} onClicked={this.onAdd}/>
          &nbsp;
          &nbsp;
          <div className="spacer"></div>
          <h1 className="episode">
            <input type="text" size="2" 
              value={this.state.episodesText} 
              onChange={this.onChangeEpisodes}
              onBlur={this.saveChangeEpisodes}
              />
            /{totalEpisodesText}
          </h1>
        	<h1 className="anime-title">{this.props.anime.title}</h1>
        </li>
      </div>
    );
  }
});
