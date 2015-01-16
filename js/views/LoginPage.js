/** @jsx React.DOM */
'use strict';

/**
 * @property {function(username, password)} onLogin
 */
var LoginPageComponent = React.createClass({displayName: "LoginPageComponent",
  onLoginClicked: function(event) {
    var username = this.refs.username.getDOMNode().value;
    var password = this.refs.password.getDOMNode().value;

    this.props.onLogin(username, password);
  },
  render: function() {
    return (
      React.createElement("div", {className: "container"}, 
        React.createElement("form", {className: "form-horizontal"}, 
          React.createElement("legend", null, React.createElement("h1", null, "Login page")), 
          React.createElement("fieldset", null, 
            React.createElement("div", {className: "form-group"}, 
              React.createElement("label", {htmlFor: "inputUsername", className: "col-lg-1 control-label"}, "Username: "), 
              React.createElement("div", {className: "col-lg-11"}, 
                React.createElement("input", {type: "text", className: "form-control", id: "inputUsername", 
                       ref: "username", placeholder: "username"})
              )
            ), 
            React.createElement("div", {className: "form-group"}, 
              React.createElement("label", {htmlFor: "inputPassword", className: "col-lg-1 control-label"}, "Password: "), 
              React.createElement("div", {className: "col-lg-11"}, 
                React.createElement("input", {type: "password", id: "inputUsername", className: "form-control", 
                       ref: "password", placeholder: "password"})
              )
            ), 
            React.createElement("div", {className: "form-group col-lg-11 col-lg-offset-1"}, 
              React.createElement("a", {className: "btn btn-primary", onClick: this.onLoginClicked}, 
                "Submit"
              )
            )
          )
        )
      )
    );
  }
});
