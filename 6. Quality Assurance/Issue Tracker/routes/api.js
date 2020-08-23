/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const mongo = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

module.exports = function (app, client) {

  app.route('/api/issues/:project')
    .get(function (req, res){
      var query = {};
      var project = req.params.project;
      console.log(req.query)
    
      //Query constructor
      for(var property in req.query){
        var property_value;
        //Ensure inherited base class properties are not included
        if (req.query.hasOwnProperty(property)) {
          if(property == 'open'){
            property_value = (req.query[property] === 'true');
          } else if (property == '_id'){
            property_value = ObjectId(req.query[property]);
          } else {
            property_value = req.query[property];
          }
          query[property] = property_value;
        }
      }
    
      client.collection(project).find(query).toArray(function(err, result) {
          if(err) {
            res.json(err);
            return;
          } else if (result.length > 0) {
            res.json(result);
            return;
          } else {
            res.json([{_id: null, issue_title: null, issue_text: null, created_on: null, updated_on: null, created_by: null, assigned_to: "updated dude", open: false, status_text: null}]);
          }
      });
    })
    
    //Insert new project issue
    .post(function (req, res){
      if(req.body.issue_title == null || req.body.issue_text == null || req.body.created_by == null){
        res.json("missing inputs");
        return;
      }
      var project = req.params.project;
      var created_on = new Date(Date.now()).toISOString();
      var updated_on = created_on;

      client.collection(project).insertOne(
        {
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_on: created_on,
          updated_on: updated_on,
          created_by: req.body.created_by,
          assigned_to: (req.body.assigned_to || ""),
          open: true,
          status_text: (req.body.status_text || "")
        }, 
        (err, result) => {
          if(err) {
            res.json("failed to submit");
            return;
          } else {
            res.json(result.ops[0]);
            return;
          }   
      })
    })
    
    .put(function (req, res){
      var project = req.params.project;
      var update = {};
    
      var updated_on = new Date(Date.now()).toISOString();
    
      for(var property in req.body){
        var property_value;
        //Ensure inherited base class properties are not included
        if (req.body.hasOwnProperty(property)) {
          if(property == 'open'){
            property_value = (req.body[property] === 'true');
            update[property] = property_value;
          } else if(req.body[property] != ''){
            property_value = req.body[property];
            update[property] = property_value;
          }      
        }
      }
    
      update["updated_on"] = updated_on;
      delete update._id;
      if(Object.keys(update).length <= 1){
        res.json("no updated field sent");
        return;
      }
    
      client.collection(project).findAndModify(
        {_id: ObjectId(req.body._id)},
        {},
        {$set: update},
        {new: true}, 
        (err, result) => {
            if(err) {
              res.json("could not update " + req.body._id);
              return;
            } else {
              res.json("successfully updated");
              return;
            } 
        });
    })
    
    .delete(function (req, res){
      if(req.body._id.length < 24){
        res.json("_id error");
        return;
      }
      var project = req.params.project;
      client.collection(project).remove({"_id": ObjectId(req.body._id)}, (err, result) => {
          if(err) {
            res.json("could not delete " + req.body._id);
            return;
          } else {
            res.json("deleted " + req.body._id);
            return;
          } 
      });
    });
    
};
