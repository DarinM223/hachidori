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

  it('should get and set object', function(done) {
    store
      .set('username', 'key', { value: 2 })
      .then(() => store.get('username'))
      .then(obj => {
        expect(obj).to.eql({ key: { value: 2 } });
        done();
      });
  });

  it('should get and set nested object', function(done) {
    store
      .set('username', 'key', { value1: ['a', 'b'], value2: { a: true, b: 2.5 } })
      .then(() => store.get('username'))
      .then(obj => {
        expect(obj).to.eql({ key: { value1: ['a', 'b'], value2: { a: true, b: 2.5 } } });
        done();
      });
  });

  it('should delete key of object', function(done) {
    store
      .set('anotherusername', 'key', 2)
      .then(() => store.remove('anotherusername', 'key'))
      .then(() => client.hexistsAsync('anotherusername', 'key'))
      .then(exists => {
        expect(exists).to.eql(0);
        done();
      });
  });
});

