'use strict';

/* eslint-disable */

var KeyValueStore = require('../KeyValueStore.js')
  , JSONEncoder = require('../JSONEncoder.js')
  , expect = require('chai').expect
  , Promise = require('bluebird')
  , redis = require('redis')
  , client = redis.createClient();

Promise.promisifyAll(client);

describe('Testing KeyValueStore', function() {
  var store;

  before(function(done) {
    store = new KeyValueStore(client);
    done();
  });

  after(function(done) {
    // clear redis
    client.flushallAsync().then(() => done());
  });

  it('should set integer', function(done) {
    store.set('hello', 2).then(() => {
      return client.getAsync('hello');
    }).then(value => {
      expect(JSONEncoder.decodeJSON(value)).to.eql(2);
      done();
    }).catch(e => console.log(e));
  });

  it('should set string', function(done) {
    store.set('hello', 'world').then(() => {
      return client.getAsync('hello');
    }).then(value => {
      expect(JSONEncoder.decodeJSON(value)).to.eql('world');
      done();
    }).catch(e => console.log(e));
  });
});

