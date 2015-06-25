'use strict';

// Node server that hosts the web app and includes a proxy for accessing the Hummingbird API

var express = require('express')
  , app = express()
  , bodyparser = require('body-parser')
  , request = require('superagent');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.all(/^\/api\/(.*)/, function(req, res) {
  var newRequest = null;

  switch (req.method) {
    case 'GET':
      newRequest = request.get;
      break;
    case 'POST':
      newRequest = request.post;
      break;
    case 'PUT':
      newRequest = request.put;
      break;
    case 'DELETE':
      newRequest = request.delete;
      break;
  }

  newRequest('https://hummingbird.me' + req.originalUrl)
    .set('Content-Type', 'application/json')
    .send(req.body).end(function(e, hummingbirdRes) {


    if (e) {
      res.status(500).send();
    } else {
      // hummingbirdRes.body holds the data
      res.json(hummingbirdRes.body);
    }
  });
});

var PORT = process.env.PORT;

var server = app.listen(PORT, function() {
  console.log('Server started');
});
