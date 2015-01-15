/** @jsx React.DOM */
/**
 * @property {function(this)} onTextChanged
 */
var AnimeSearchComponent = React.createClass({displayName: 'AnimeSearchComponent',
  onTextChanged: function(event) {
    this.props.onTextChanged(event.target.value);
  },
  render: function() {
    return (
      React.createElement("input", {type: "text", className: "form-control", placeholder: "Search your anime list", 
             onChange: this.onTextChanged})
    );
  }
});
