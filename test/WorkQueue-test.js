'use strict';

/* eslint-disable */

var expect = require('chai').expect
  , Promise = require('bluebird')
  , WorkQueue = require('../js/WorkQueue.js');

describe('Testing WorkQueue', function() {
  it('should run the enqueued function that returns a promise', function(done) {
    var queue = new WorkQueue();
    queue.enqueueWork(() => Promise.delay(0).then(() => done()));
  });

  it('should run two functions that return promises in order', function(done) {
    var queue = new WorkQueue();

    var fn1 = () => Promise.resolve();
    var fn2 = () => Promise.delay(0).then(() => done());

    queue.enqueueWork(fn1);
    queue.enqueueWork(fn2);
  });

  it('should run two enqueued functions in order and pass in values to the next enqueued function', function(done) {
    var queue = new WorkQueue();

    var fn1 = () => Promise.resolve('value 1');
    var fn2 = (value1) => {
      expect(value1).to.eql('value 1');
      return Promise.delay(0).then(() => done());
    };

    queue.enqueueWork(fn1);
    queue.enqueueWork(fn2);
  });

  it('should run two functions, stopping at the function that doesn\'t return a promise', function(done) {
    var queue = new WorkQueue();

    var fn1 = () => Promise.resolve();
    var fn2 = () => done();

    queue.enqueueWork(fn1);
    queue.enqueueWork(fn2);
  });
});

