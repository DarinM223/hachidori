'use strict';

/* eslint-disable */

var expect = require('chai').expect
  , request = require('request-promise')
  , Promise = require('bluebird')
  , app = require('../server.js')
  , JSONEncoder = require('../JSONEncoder.js');

Promise.promisifyAll(request);

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
      expect(data).to.eql('null');
      done();
    });
  });

  it('should properly set integer', function(done) {
    request({
      method: 'POST',
      uri: `http://localhost:${ TEST_PORT }/storage/${ TEST_USERNAME }`,
      form: { userData: JSONEncoder.encodeJSON({ hello: 'world' }) }
    }).then(data => {
      expect(data).to.eql('');
      return request(`http://localhost:${ TEST_PORT }/storage/${ TEST_USERNAME }`);
    }).then(data => {
      expect(data).to.eql(JSONEncoder.encodeJSON({ hello: 'world' }));
      done();
    });
  });
});

