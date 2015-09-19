'use strict';

/* eslint-disable */

var expect = require('chai').expect
  , request = require('request-promise')
  , Promise = require('bluebird')
  , app = require('../server.js')
  , JSONEncoder = require('../JSONEncoder.js');

const TEST_PORT = 5000;
const TEST_USERNAME = 'hello';

describe('Testing server routes', function() {
  before(function(done) {
    app.listen(TEST_PORT, () => done());
  });

  after(function(done) {
    app.locals.store.client.flushallAsync().then(() => done());
  });

  it('should get something', function(done) {
    request(`http://127.0.0.1:${ TEST_PORT }/storage/blahblahblah`).then(data => {
      expect(data).to.eql(JSON.stringify({}));
      done();
    });
  });

  it('should properly set key', function(done) {
    request({
      method: 'POST',
      uri: `http://localhost:${ TEST_PORT }/storage/hello/key`,
      form: { value: JSONEncoder.encodeJSON({ hello: 'world' }) }
    }).then(data => {
      expect(data).to.eql('');
      return request(`http://localhost:${ TEST_PORT }/storage/hello`);
    }).then(data => {
      expect(data).to.eql(JSON.stringify({ key: { hello: 'world' } }));
      done();
    });
  });

  it('should properly remove key', function(done) {
    request({
      method: 'POST',
      uri: `http://localhost:${ TEST_PORT }/storage/world/key`,
      form: { value: 2 }
    }).then(data => {
      expect(data).to.eql('');
      return request({
        method: 'DELETE',
        uri: `http://localhost:${ TEST_PORT }/storage/world/key`
      });
    }).then(() => {
      return app.locals.store.client.hexistsAsync('world', 'key')
    }).then(exists => {
      expect(exists).to.eql(0);
      done();
    });
  });
});

