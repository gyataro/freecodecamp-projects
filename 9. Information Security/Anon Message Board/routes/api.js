/*
 *
 *
 *       Complete the API routing below
 *
 *
 */
'use strict';

var expect = require('chai').expect;
var express = require('express');
var ObjectId = require('mongodb').ObjectId;
var bcrypt = require('bcrypt');

module.exports = function(app, client) {

	app.route('/api/threads/:board')
		.post(function(req, res) {
			const THREAD_CREATION_DATE = new Date().toISOString();
      const THREAD_TEXT = safeTag(req.body.text);
      const THREAD_PASSWORD = req.body.delete_password;
    
      const TARGET_BOARD = (req.body.board || req.params.board);
    
      bcrypt.hash(THREAD_PASSWORD, 10, function(err, REPLY_PASSWORD_HASH) {
				if (err) {
					handleError(err)
					res.redirect('/');
				} else {
          client.collection(TARGET_BOARD).insertOne({
            text: THREAD_TEXT,
            created_on: THREAD_CREATION_DATE,
            bumped_on: THREAD_CREATION_DATE,
            reported: false,
            delete_password: REPLY_PASSWORD_HASH,
            replies: [],
            replycount: 0
          }, function(err, result) {
            if (err) {
              handleError(err);
              res.redirect('/');
            } else {
              res.redirect('/b/' + TARGET_BOARD + '/');
            }
          });
        }
      });
		})
  
    .get(function(req, res) {
      const TARGET_BOARD = req.params.board;
      const SETTINGS_THREAD_AMOUNT = 10;
      
      var threads_array = [];
    
      threads_array = client.collection(TARGET_BOARD)
        .find()
        .sort({ bumped_on: -1 })
        .limit(SETTINGS_THREAD_AMOUNT)
        .project({ delete_password: 0, reported: 0, replies: { $slice: -3 } })
        .toArray();
      
      threads_array.then(function(result) {
        res.json(result);
      })
    })
  
    .delete(function(req, res) {
      const TARGET_BOARD = req.params.board;
      const THREAD_PASSWORD = req.body.delete_password;
      const THREAD_ID = req.body.thread_id;
      
      client.collection(TARGET_BOARD).findOne({ _id: ObjectId(THREAD_ID) }, function(err, result){
        if (err) {
          handleError(err);
          res.redirect('/');
        } else {
          if(result == null){
            res.status(200).json('incorrect password');
            return
          }
          bcrypt.compare(THREAD_PASSWORD, result.delete_password, function(err, match) {
            if (err) {
              handleError(err);
            } else {
              if (match == false) {
                res.status(200).json('incorrect password');
                return
              } else {
                client.collection(TARGET_BOARD).deleteOne({ _id: ObjectId(THREAD_ID) }, function(err, result){
                  if (err) {
                    handleError(err);
                    res.redirect('/');
                  } else {
                    res.status(200).json('success');
                  }
                })
              }
            }
          });
        }
      })
    })
  
    .put(function(req, res){
      const TARGET_BOARD = req.params.board;
      const THREAD_REPORT_ID = req.body.report_id;
    
      client.collection(TARGET_BOARD).updateOne({ _id: ObjectId(THREAD_REPORT_ID) }, { $set: {reported: true} }, function(err, result){
        if(err){
          handleError(err);
          res.redirect('/');
        } else {
          res.status(200).send('reported');
        }
      })
    })

	app.route('/api/replies/:board')
		.post(function(req, res) {
			const REPLY_CREATION_DATE = new Date().toISOString();
      const REPLY_TEXT = safeTag(req.body.text);
      const REPLY_PASSWORD = req.body.delete_password;
    
      const TARGET_THREAD_ID = req.body.thread_id;
      const TARGET_BOARD = (req.body.board || req.params.board);

			//Password encryption
			bcrypt.hash(REPLY_PASSWORD, 10, function(err, REPLY_PASSWORD_HASH) {
				if (err) {
					handleError(err)
					res.redirect('/');
				} else {
					client.collection(TARGET_BOARD).findAndModify({
						_id: ObjectId(TARGET_THREAD_ID)
					}, {}, {
						$set: {
							bumped_on: REPLY_CREATION_DATE
						},
						$push: {
							replies: {
                _id: new ObjectId(),
								text: REPLY_TEXT,
								created_on: REPLY_CREATION_DATE,
								reported: false,
								delete_password: REPLY_PASSWORD_HASH
							}
						},
            $inc: {
              replycount: 1
            }
					}, {
						new: true
					}, function(err, result) {
						if (err) {
							handleError(err);
							res.redirect('/');
						} else {
							res.redirect('/b/' + TARGET_BOARD + '/' + TARGET_THREAD_ID);
						}
					})
				}

			});
		})
  
    .get(function(req, res) {
      const TARGET_BOARD = req.params.board;
      const TARGET_THREAD_ID = req.query.thread_id;
      
      var replies_array = [];
    
      replies_array = client.collection(TARGET_BOARD)
        .find( { _id: ObjectId(TARGET_THREAD_ID) } )
        .project( { delete_password: 0, reported: 0, 'replies.delete_password': 0, 'replies.reported': 0 } )
        .toArray();
      
      replies_array.then(function(result) {
        res.json(result[0]);
      })
    })
  
    .delete(function(req, res) {
      const TARGET_BOARD = req.params.board;
      const THREAD_ID = req.body.thread_id;
    
      const REPLY_PASSWORD = req.body.delete_password;
      const REPLY_ID = req.body.reply_id;
      
      client.collection(TARGET_BOARD).findOne({_id: ObjectId(THREAD_ID)}, {replies: {$elemMatch: {_id: ObjectId(REPLY_ID)}}}, function(err, result){
        if (err) {
          handleError(err);
          res.redirect('/');
        } else {
          if (result == null){
            res.status(200).json('incorrect password');
            return
          }
          bcrypt.compare(REPLY_PASSWORD, result.replies[0].delete_password, function(err, match) {
            if (err) {
              handleError(err);
            } else {
              if (match == false) {
                res.status(200).json('incorrect password');
                return
              } else {
                client.collection(TARGET_BOARD).update({ 
                  _id: ObjectId(THREAD_ID), 
                  "replies._id": ObjectId(REPLY_ID) }, { 
                  $set: {"replies.$.text": '[deleted]'} },
                  function(err, result){
                  if (err) {
                    handleError(err);
                    res.redirect('/');
                  } else {
                    res.status(200).json('success');
                  }
                })
              }
            }
          });
        }
      })
    })
  
    .put(function(req, res){
      const TARGET_BOARD = req.params.board;
      const THREAD_ID = req.body.thread_id;
      const REPLY_REPORT_ID = req.body.reply_id;
      
      client.collection(TARGET_BOARD).update({
        _id: ObjectId(THREAD_ID), 
        "replies._id": ObjectId(REPLY_REPORT_ID)}, {
        $set: {"replies.$.reported": true}
      }, function(err, result){
        if (err) {
          handleError(err);
          res.redirect('/');
        } else {
          res.status(200).send('reported');
        }
      })
    })

};

function handleError(err) {
  if(process.env.NODE_ENV == 'test'){
    console.log(err)
  }
}

function safeTag(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
}
