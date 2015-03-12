'use strict';

/*
 * A promise based work queue that handles asynchronous work one by one
 * You can push work to the end of the queue and it will be finished after the other work finishes
 */

/**
 * A work node
 * @param {function} fn the function that runs and returns promise
 * @constructor
 */
function WorkNode(fn) {
  this.fn = fn;
  this.next = null;
}

/**
 * An asynchronous work queue 
 * @constructor
 */
function WorkQueue() {
  this.head = null;
  this.tail = null;
}

/**
 * Adds a new function to be run asynchronously to the end of the queue
 * and if the queue was empty executes the function
 * @param {function} fn the function that runs and returns promise
 */
WorkQueue.prototype.enqueueWork = function(fn) {
  var workNode = new WorkNode(fn);
  if (this.head === null) { 
    console.log('Work node: ' + workNode);
    this.head = workNode;
    this.tail = this.head;
    this.executeHead(); 
  } else {
    this.tail.next = workNode;
    this.tail = this.tail.next;
  }
};

/**
 * Executes the current node's function and after finished, removes the node from the queue
 * and executes the next node in the queue if there is one
 */
WorkQueue.prototype.executeHead = function() {
  var that = this;

  if (this.head !== null) {

    console.log('Running current head');
    this.head.fn().then(function() {
      that.head = that.head.next; 
      if (that.head !== null) {
        console.log('Moving to next node');
        setTimeout(that.executeHead.bind(that), 0); 
      } else {
        that.tail = null; // clean up tail node
      }
    });

  }
};

module.exports = WorkQueue;
