/** @jsx React.DOM */
'use strict';

/**
 * @property {function(username, password)} onLogin
 */
var LoginPageComponent = React.createClass({
  onLoginClicked: function(event) {
    var username = this.refs.username.getDOMNode().value;
    var password = this.refs.password.getDOMNode().value;

    this.props.onLogin(username, password);
  },
  render: function() {
    return (
      <div className="container">
        <form className="form-horizontal">
          <legend><h1>Login page</h1></legend>
          <fieldset>
            <div className="form-group">
              <label htmlFor="inputUsername" className="col-lg-1 control-label">Username: </label>
              <div className="col-lg-11">
                <input type="text" className="form-control" id="inputUsername" 
                       ref="username" placeholder="username"/>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="inputPassword" className="col-lg-1 control-label">Password: </label>
              <div className="col-lg-11">
                <input type="password" id="inputUsername" className="form-control" 
                       ref="password" placeholder="password"/> 
              </div>
            </div>
            <div className="form-group col-lg-11 col-lg-offset-1">
              <a className="btn btn-primary" onClick={this.onLoginClicked}>
                Submit
              </a>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
});
