'use strict';

/**
 * @property {Anime} anime
 * @property {function()} onClicked
 */
var AnimeItemAddComponent = React.createClass({
  onClicked: function() {
    this.props.onClicked();
  },
  render: function() {
    return (
      <input type="button" className="btn btn-warning btn-lg" onClick={this.onClicked.bind(null)} value="+"/>
    );
  }
});
