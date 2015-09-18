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
    store
      .set('hello', 2)
      .then(() => client.getAsync('hello'))
      .then(value => {
        expect(JSONEncoder.decodeJSON(value)).to.eql(2);
        done();
      })
      .catch(e => console.log(e));
  });

  it('should set string', function(done) {
    store
      .set('hello', 'world')
      .then(() => client.getAsync('hello'))
      .then(value => {
        expect(JSONEncoder.decodeJSON(value)).to.eql('world');
        done();
      })
      .catch(e => console.log(e));
  });

  it('should get integer', function(done) {
    store
      .set('world', 2)
      .then(() => store.get('world'))
      .then(value => {
        expect(value).to.eql(2);
        done();
      })
      .catch(e => console.log(e));
  });

  it('should get string', function(done) {
    store
      .set('world', 'world')
      .then(() => store.get('world'))
      .then(value => {
        expect(value).to.eql('world');
        done();
      })
      .catch(e => console.log(e));
  });

  it('should remove key-value pair', function(done) {
    store
      .set('foo', { a: 2, b: 3 })
      .then(() => store.get('foo'))
      .then(value => {
        expect(value).to.eql({ a: 2, b: 3 });
        return store.remove('foo');
      })
      .then(() => store.get('foo'))
      .then(value => {
        expect(value).to.eql(null);
        done();
      })
      .catch(e => console.log(e));
  });
});

