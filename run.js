'use strict';

require('bootstrap');

var React = require('react');
var App = require('./js/views/app.js');

React.render(
  React.createElement(App, null),
  document.getElementById('app')
);
