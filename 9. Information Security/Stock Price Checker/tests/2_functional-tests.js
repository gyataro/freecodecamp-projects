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
var server = require('../server');
var stock_likes;

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'NFLX'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.isAtLeast(parseFloat(res.body.stockData.price), 0);
          assert.isAtLeast(res.body.stockData.likes, 0);
          stock_likes = res.body.stockData.likes;
          done();
        });
      });
      
      test('1 stock with like', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'NFLX', like: 'true'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, 'NFLX');
          assert.isAtLeast(parseFloat(res.body.stockData.price), 0);
          assert.equal(res.body.stockData.likes, stock_likes+1);
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'NFLX', like: 'true'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.isAtLeast(parseFloat(res.body.stockData.price), 0);
          assert.equal(res.body.stockData.likes, stock_likes+1);
          done();
        });
      });
      
      test('2 stocks', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['MSFT', 'AMZN']})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body.stockData[0], 'stock');
          assert.property(res.body.stockData[1], 'stock');
          assert.property(res.body.stockData[0], 'rel_likes');
          assert.property(res.body.stockData[1], 'rel_likes');
          assert.equal(res.body.stockData[0].stock, 'GOOG');
          assert.equal(res.body.stockData[1].stock, 'MSFT');
          assert.isAtLeast(parseFloat(res.body.stockData[0].price), 0);
          assert.isAtLeast(parseFloat(res.body.stockData[1].price), 0);
          assert.isAtLeast(res.body.stockData[0].rel_likes, 0);
          assert.isAtLeast(res.body.stockData[1].rel_likes, -1);
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['MSFT', 'AMZN'], like: 'true'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body.stockData[0], 'stock');
          assert.property(res.body.stockData[1], 'stock');
          assert.property(res.body.stockData[0], 'rel_likes');
          assert.property(res.body.stockData[1], 'rel_likes');
          assert.equal(res.body.stockData[0].stock, 'GOOG');
          assert.equal(res.body.stockData[1].stock, 'AMZN');
          assert.isAtLeast(parseFloat(res.body.stockData[0].price), 0);
          assert.isAtLeast(parseFloat(res.body.stockData[1].price), 0);
          assert.isAtLeast(res.body.stockData[0].rel_likes, 0);
          assert.isAtLeast(res.body.stockData[1].rel_likes, -1);
          done();
        });
      });
      
    });

});
