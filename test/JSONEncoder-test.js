'use strict';

/* eslint-disable */

var JSONEncoder = require('../JSONEncoder.js')
  , expect = require('chai').expect;

describe('Testing JSONEncoder', function() {
  it('should properly encode and decode integers', function(done) {
    var jsonString = JSONEncoder.encodeJSON(2);
    var value = JSONEncoder.decodeJSON(jsonString);
    expect(value).to.eql(2);
    done();
  });

  it('should properly encode and decode floats', function(done) {
    var jsonString = JSONEncoder.encodeJSON(3.14159);
    var value = JSONEncoder.decodeJSON(jsonString);
    expect(value).to.eql(3.14159);
    done();
  });

  it('should properly encode and decode booleans', function(done) {
    var jsonString = JSONEncoder.encodeJSON(true);
    var value = JSONEncoder.decodeJSON(jsonString);
    expect(value).to.eql(true);
    done();
  });

  it('should properly encode and decode strings', function(done) {
    var jsonString = JSONEncoder.encodeJSON('hello world!');
    var value = JSONEncoder.decodeJSON(jsonString);
    expect(value).to.eql('hello world!');
    done();
  });

  it('should properly encode and decode arrays', function(done) {
    var jsonString = JSONEncoder.encodeJSON([1, 2, 3, 4]);
    var value = JSONEncoder.decodeJSON(jsonString);
    expect(value).to.eql([1, 2, 3, 4]);
    done();
  });

  it('should properly encode and decode objects', function(done) {
    var jsonString = JSONEncoder.encodeJSON({ a: 2, b: true, c: 'hello' });
    var value = JSONEncoder.decodeJSON(jsonString);
    expect(value).to.eql({ a: 2, b: true, c: 'hello' });
    done();
  });

  it('should properly encode and decode nested objects', function(done) {
    var jsonString = JSONEncoder.encodeJSON({ a: { a: true }, b: { b: 3, c: { c: 2 } }, c: 'hello' });
    var value = JSONEncoder.decodeJSON(jsonString);
    expect(value).to.eql({ a: { a: true }, b: { b: 3, c: { c: 2 } }, c: 'hello' });
    done();
  });

  it('should properly encode and decode arrays of objects', function(done) {
    var jsonString = JSONEncoder.encodeJSON([{ a: true, b: 3 }, { a: { a: 2 }, b: [1, 2] }]);
    var value = JSONEncoder.decodeJSON(jsonString);
    expect(value).to.eql([{ a: true, b: 3 }, { a: { a: 2 }, b: [1, 2] }]);
    done();
  });

  it('should properly encode and decode null', function(done) {
    var jsonString = JSONEncoder.encodeJSON({ a: null });
    var value = JSONEncoder.decodeJSON(jsonString);
    expect(value).to.eql({ a: null });
    done();
  });
});

