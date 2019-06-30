/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    let thread_to_test;
    
    suite('POST', function() {
      test('POST a new thread', function(done) {
       chai.request(server)
        .post('/api/threads/fcc')
        .send({text: 'Chai testing thread', delete_password: 'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          expect(err).to.be.null;
          expect(res).to.redirect;
          done();
        });
      });
    });
    
    suite('GET', function() {
      test('GET an array of the most recent 10 bumped threads, with only the most recent 3 replies', function(done) {
       chai.request(server)
        .get('/api/threads/fcc')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], '_id');
          thread_to_test = res.body[0]._id;
          assert.property(res.body[0], 'text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'bumped_on');
          assert.property(res.body[0], 'replies');
          assert.notProperty(res.body[0], 'delete_password');
          assert.notProperty(res.body[0], 'reported');
          assert.isArray(res.body[0].replies);
          expect(err).to.be.null;
          done();
        });
      });
    });
    
    suite('PUT', function() {
      test('PUT to report a thread', function(done) {
       chai.request(server)
        .put('/api/threads/fcc')
        .send({report_id: thread_to_test})
        .end(function(err, res){
          assert.equal(res.status, 200);
          expect(err).to.be.null;
          expect(res).to.not.redirect;
          done();
        });
      });
    });
    
    suite('DELETE', function() {
      test('DELETE a thread', function(done) {
       chai.request(server)
        .delete('/api/threads/fcc')
        .send({thread_id: thread_to_test, delete_password: 'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          expect(err).to.be.null;
          expect(res).to.not.redirect;
          done();
        });
      });
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    let thread_to_test;
    let reply_to_test;
    
    //Create a thread for testing
    chai.request(server)
      .post('/api/threads/fcc')
      .send({text: 'Chai reply testing thread', delete_password: 'pass'})
      .end(function(err, res){

      });
    
    //Get the thread id for testing
    chai.request(server)
      .get('/api/threads/fcc')
      .end(function(err, res){
        thread_to_test = res.body[0]._id;
      });
    
    suite('POST', function() {
      test('POST a new reply', function(done) {
       chai.request(server)
        .post('/api/replies/fcc')
        .send({board: 'fcc', thread_id: thread_to_test, text: 'Chai reply', delete_password: 'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          expect(err).to.be.null;
          expect(res).to.redirect;
          done();
        });
      });
    });
    
    suite('GET', function() {
      test('GET an entire thread with all replies', function(done) {
       chai.request(server)
        .get('/api/replies/fcc/')
        .query({thread_id: thread_to_test})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body.replies);
          assert.property(res.body.replies[0], '_id');
          reply_to_test = res.body.replies[0]._id;
          assert.property(res.body.replies[0], 'text');
          assert.property(res.body.replies[0], 'created_on');
          assert.notProperty(res.body.replies[0], 'delete_password');
          assert.notProperty(res.body.replies[0], 'reported');
          expect(err).to.be.null;
          done();
        });
      });
    });
    
    suite('PUT', function() {
      test('PUT to report a reply', function(done) {
       chai.request(server)
        .put('/api/threads/fcc')
        .send({thread_id: thread_to_test, reply_id: reply_to_test})
        .end(function(err, res){
          assert.equal(res.status, 200);
          expect(err).to.be.null;
          expect(res).to.not.redirect;
          done();
        });
      });
    });
    
    suite('DELETE', function() {
      test('DELETE to delete a reply (correct password)', function(done) {
       chai.request(server)
        .delete('/api/threads/fcc')
        .send({thread_id: thread_to_test, reply_id: reply_to_test, delete_password: 'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body, 'success')
          expect(err).to.be.null;
          expect(res).to.not.redirect;
          done();
        });
      });
      
      test('DELETE to delete a reply (incorrect password)', function(done) {
       chai.request(server)
        .delete('/api/threads/fcc')
        .send({thread_id: thread_to_test, reply_id: reply_to_test, delete_password: 'wrongpass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body, 'incorrect password')
          expect(err).to.be.null;
          expect(res).to.not.redirect;
          done();
        });
      });
    });
    
  });

});
