/**
 * @property {function(this)} onTextChanged
 */
var AnimeSearchComponent = React.createClass({
  onTextChanged: function(event) {
    this.props.onTextChanged(event.target.value);
  },
  render: function() {
    return (
      <input type="text" className="form-control" placeholder="Search your anime list" 
             onChange={this.onTextChanged}/>
    );
  }
});
