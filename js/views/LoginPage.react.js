'use strict';

var React = require('react');

/**
 * @property {function(username, password)} onLogin
 */
var LoginPageComponent = React.createClass({
  onLoginClicked: function() {
    var username = this.refs.username.getDOMNode().value;
    var password = this.refs.password.getDOMNode().value;

    this.props.onLogin(username, password);
  },

  render: function() {
    return (
      <div className="container">
        <form className="form-horizontal">
          <legend><h1>Login to Hummingbird</h1></legend>
          <fieldset>
            <div className="form-group">
              <div className="col-lg-10">
                <input type="text" className="form-control" id="inputUsername" 
                       ref="username" placeholder="Hummingbird username"/>
              </div>
            </div>
            <div className="form-group">
              <div className="col-lg-10">
                <input type="password" id="inputUsername" className="form-control" 
                       ref="password" placeholder="Hummingbird password"/> 
              </div>
            </div>
            <div className="form-group col-lg-11 col-lg-offset-1">
              <a className="btn btn-primary" onClick={this.onLoginClicked}>
                Login
              </a>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
});

module.exports = LoginPageComponent;

