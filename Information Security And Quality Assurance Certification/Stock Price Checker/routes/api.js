/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var Request = require("request");

module.exports = function (app, client) {
  
  app.route('/api/stock-prices')
    .get(function (req, res){
    
      //Client's ip address
      var ip = req.headers['x-forwarded-for'].split(',')[0] || req.connection.remoteAddress;
    
      //Used to get the list of stocks entered by the user
      var query_stocks;
    
      //Flag to check if user entered more than one stock
      var is_batch = false;
    
      if(Array.isArray(req.query.stock)){
        query_stocks = req.query.stock.join(",");
        is_batch = true;
      } else {
        query_stocks = req.query.stock;
      }
      
      var base_url = "https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=STOCKS&apikey=USERKEY"
      var request_url = base_url.replace("STOCKS", query_stocks).replace("USERKEY", process.env.STOCK_API_KEY);

      Request.get(request_url, (err, response, body) => {
        if(err) {
          //API server error
          res.json({error: err});
          return
        }
        
        var stock_list = JSON.parse(body)["Stock Quotes"];
        var stock_data = {}; //JSON Output
        var stock_name_array = []; //Temporary Stock Name Holder
        var stock_data_array = []; //Temporary Stock Data Holder
        var bulk_writer = []; //mongoDB Bulk Writer Operations
        
        for(var i = 0; i < stock_list.length; i++){
            var tempKey = Object.keys(stock_list)[i];
            var tempSymbol = stock_list[tempKey]["1. symbol"];
            var tempPrice = stock_list[tempKey]["2. price"];
          
            stock_name_array.push(tempSymbol);
            stock_data_array.push({stock: tempSymbol, price: tempPrice});
            
            //Add stock name to database if it doesnt exist
            bulk_writer.push({updateOne: {
              filter: {stock: tempSymbol},
              update: {$setOnInsert: {stock: tempSymbol, likes: 0, liked_by: []}},
              upsert: true
            }})
            
            //Only +1 like if this ip is new ip / when users wants to like it
            if(req.query.like == 'true'){
              bulk_writer.push({updateOne: {
                filter: {stock: tempSymbol, liked_by: {$not: {$in: [ip]}}},
                update: {$inc: {likes: 1}, $push: {liked_by: ip}},
                upsert: false
              }});
            }
        }
        
        //Only connect to database for bul writing if there are requests (not zero)
        if(bulk_writer.length > 0){
          client.collection('stocks').bulkWrite(bulk_writer);
        }
        
        //Get the likes of stocks, and add them to the output
        client.collection('stocks').find({stock: {$in: stock_name_array}}).toArray((err, result) => {
          if(err){
            res.json({error: err})
            return
          } else if (result.length > 1) {
            for(var i = 0; i < result.length; i++){
              //var like_index = stock_likes_array.map(function(item) { return item.stock; }).indexOf(stock_name_array[i]);
              var like_target = stock_data_array.map(function(item) { return item.stock; }).indexOf(result[i].stock);
              stock_data_array[like_target].rel_likes = result[i].likes - result[0].likes;
            }
          } else if (result.length == 1){
            stock_data_array[0].likes = result[0].likes;
          }
          
          //Display as array if there's more than 1 stock item
          if(stock_list.length == 1){
            stock_data.stockData = stock_data_array[0];
          } else if(stock_list.length > 1) {
            stock_data.stockData = stock_data_array;
          } else {
            stock_data.stockData = {};
          }
          res.json(stock_data);
          return
          
        });
        
      });
    });
    
};
