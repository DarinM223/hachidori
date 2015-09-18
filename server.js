'use strict';

// Node server that hosts the web app and includes a proxy for accessing the Hummingbird API

var express = require('express')
  , redis = require('redis')
  , app = express()
  , client = redis.createClient(process.env.REDIS_URL)
  , KeyValueStore = require('./KeyValueStore.js')
  , JSONEncoder = require('./JSONEncoder.js')
  , bodyparser = require('body-parser')
  , request = require('superagent');

/*
 * Expose the app server
 */
module.exports = app;

client.on('error', function(err) {
  console.log('Redis Error: ', err);
});

var keyValueStore = new KeyValueStore(client);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.locals.store = keyValueStore;

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
      res.status(500).send(e + '');
    } else {
      // hummingbirdRes.body holds the data
      res.json(hummingbirdRes.body);
    }
  });
});

app.get('/storage/:username', function(req, res) {
  var username = req.params.username;
  if (typeof username === 'undefined' || username === null) {
    res.status(500).send(new Error('Username parameter not defined'));
    return;
  }

  keyValueStore.get(username).then(data => res.json(data)).catch(e => res.status(500).send(e + ''));
});

app.post('/storage/:username', function(req, res) {
  var username = req.params.username;
  var userData = req.body.userData;
  if (typeof username === 'undefined' || username === null) {
    res.status(500).send('Username parameter not defined');
    return;
  }
  if (typeof userData === 'undefined' || userData === null) {
    res.status(500).send('userData form parameter not defined');
    return;
  }

  try {
    userData = JSONEncoder.decodeJSON(userData);
  } catch (e) {
    res.status(500).send(e + '');
    return;
  }

  keyValueStore.set(username, userData).then(() => res.status(200).send('')).catch(e => res.status(500).send(e + ''));
});

app.delete('/storage/:username', function(req, res) {
  var username = req.params.username;
  if (typeof username === 'undefined' || username === null) {
    res.status(500).send('Username parameter not defined');
    return;
  }

  keyValueStore.remove(username).then(() => res.status(200).send('')).catch(e => res.status(500).send(e + ''));
});

