'use strict';

// Node server that hosts the web app and includes a proxy for accessing the Hummingbird API

var express = require('express');
var app = express();

app.use(express.static('public'));

var PORT = process.env.PORT;

var server = app.listen(PORT, function() {
  console.log('Server started');
});
