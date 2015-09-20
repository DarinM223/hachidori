'use strict';

// Node server that hosts the web app and includes a proxy for accessing the Hummingbird API

var express = require('express')
  , redis = require('redis')
  , app = express()
  , client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOSTNAME, { no_ready_check: true })
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

// TODO(darin): selectively block domains
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

app.use(allowCrossDomain);
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

app.post('/storage/:username/:key', function(req, res) {
  var username = req.params.username;
  var key = req.params.key;
  var value = JSONEncoder.decodeJSON(req.body.value);

  if (typeof username === 'undefined' || username === null) {
    res.status(500).send('Username parameter not defined');
    return;
  }
  if (typeof key === 'undefined' || key === null || typeof key !== 'string') {
    res.status(500).send('key parameter not defined');
    return;
  }
  if (typeof value === 'undefined' || value === null) {
    res.status(500).send('value parameter not defined');
    return;
  }

  keyValueStore.set(username, key, value).then(() => res.status(200).send('')).catch(e => res.status(500).send(e + ''));
});

app.delete('/storage/:username/:key', function(req, res) {
  var username = req.params.username;
  var key = req.params.key;

  if (typeof username === 'undefined' || username === null) {
    res.status(500).send('Username parameter not defined');
    return;
  }
  if (typeof key === 'undefined' || key === null || typeof key !== 'string') {
    res.status(500).send('Key parameter not defined');
    return;
  }

  keyValueStore.remove(username, key).then(() => res.status(200).send('')).catch(e => res.status(500).send(e + ''));
});

