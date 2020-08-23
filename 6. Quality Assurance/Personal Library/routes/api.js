/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;


module.exports = function (app, client) {

  app.route('/api/books')
    .get(function (req, res){
    
      client.collection("library").find({}, {_id: 1, title: 1, commentcount: 1}).toArray(function(err, result) {
        if(err){
          res.json({error: err});
          return
        } else {
          res.json(result);
          return
        }
      });
    })
    
    .post(function (req, res){
    
      var book_regex = /^(?! )[A-Za-z0-9 :-]*(?<! )$/ig
      var space_regex = /\s{2,}/ig
      
      if(req.body.title == null || req.body.title == "" || !book_regex.test(req.body.title) || space_regex.test(req.body.title)){
        res.json({error: "invalid book name"})
        return
      }
    
      client.collection("library").findAndModify(
      {title: req.body.title},
      {},
      {$setOnInsert: {title: req.body.title, commentcount: 0, comments: []}},
      {new: true, upsert: true},
      (err, result) => {
        if(err){
          res.json({error: err});
          return
        } else {
          res.json(result.value);
          return
        }
      });
    })
    
    .delete(function(req, res){
    
      client.collection("library").drop(function(err, result){
        if(err){
          res.json({error: err});
          return
        } else {
          res.json("complete delete successful");
          return
        }
      });
    });

  app.route('/api/books/:id')
    .get(function (req, res){
    
      if(req.params.id.length < 24){
        res.json("no book exists");
        return
      }
    
      client.collection("library").findOne({_id: ObjectId(req.params.id)}, function(err, result) {
        if(err){
          res.json({error: err});
          return
        } else {
          if(result == null){
            res.json("no book exists");
            return
          } else {
            res.json(result);
            return
          }
        }
      });
    })
    
    .post(function(req, res){
    
      client.collection("library").findAndModify(
      {_id: ObjectId(req.params.id)},
      {},
      {$push: {comments: req.body.comment}, $inc: {commentcount: 1}},
      {new: true},
      (err, result) => {
        if(err){
          res.json({error: err});
          return
        } else {
          res.json({ _id: result.value._id, title: result.value.title, commentcount: result.value.commentcount, comments: result.value.comments});
          return
        }
      });
    })
    
    .delete(function(req, res){

      client.collection("library").findOneAndDelete({_id: ObjectId(req.params.id)}, {}, function(err, result){
        if(err){
          res.json({error: err});
          return
        } else {
          res.json("delete successful");
          return
        }
      });
    });
  
};
