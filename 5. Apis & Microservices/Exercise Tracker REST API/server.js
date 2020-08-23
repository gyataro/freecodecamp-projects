'use strict';

// Node.js framework
var express = require('express');

// Database
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// CORS security module
var cors = require('cors');

var crypto = require('crypto');

var app = express();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
app.use(cors())

var userSchema = new mongoose.Schema({
  username: String,
  userId: String,
  count: Number,
  log: [{description: String, duration: Number, date: Date}]
});

var User = mongoose.model('User', userSchema);

// Mounting body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get("/api/exercise/log", function(req, res){
  let USERID = (req.query.userId || null);
  let FROM_DATE = (req.query.from == undefined)? new Date(0) : new Date(req.query.from.toString());
  let TO_DATE = (req.query.to == undefined)? new Date(Date.now()) : new Date(req.query.to.toString());
  let LIMIT = (parseInt(req.query.limit, 10) || -1);
  
  console.log(FROM_DATE)
  if(FROM_DATE == "Invalid Date" || TO_DATE == "Invalid Date"){
    res.json({error: "Invalid date format, date must be YYYY-MM-DD"})
    return;
  }
  
  if(USERID == null){
    res.json({error: "The userId field cannot be empty"});
    return;
  } else {
    User.aggregate([
      {$match: {userId: USERID}},
      {$unwind: '$log'},
      {$match: {'log.date': {$gte: FROM_DATE, $lte: TO_DATE}}},
      {$project: { userId : 1 , username : 1 , log : 1}},
      {$group: {"_id": "_$id", "userId": {"$first": "$userId"}, "username": {"$first": "$username"}, "log": {$push: '$log'}}}
      ]).exec((err, data)=>{
      if(err){
        res.json({error: err});
        return;
      }
      
      console.log(data);
      
      if(!data[0].hasOwnProperty("log")){
        res.json({userId: data[0].userId, username: data[0].username, count: 0, log: "No matches"})
        return;
      }
      
      let LOGS = data[0].log;
      let OUTPUT_LOG_ENTRY = [];

      if(LIMIT > LOGS.length){
        LIMIT = LOGS.length;
      }
      
      if(LIMIT > -1){
        for(var i = LOGS.length - 1; i>=LOGS.length - LIMIT; i--){
          OUTPUT_LOG_ENTRY.push({description: LOGS[i]["description"], duration: LOGS[i]["duration"], date: LOGS[i]["date"].toDateString()});
        }
      } else {
        for(var i = LOGS.length - 1; i>=0; i--){
          OUTPUT_LOG_ENTRY.push({description: LOGS[i]["description"], duration: LOGS[i]["duration"], date: LOGS[i]["date"].toDateString()});
        }
      }
      res.json({userId: data[0].userId, username: data[0].username, count: OUTPUT_LOG_ENTRY.length, log: OUTPUT_LOG_ENTRY});
      return;
      
    })
  }
})

// Create new user, but make sure user isn't already exist
app.post("/api/exercise/new-user", function(req, res){
  const USERNAME = req.body.username;
  const USERID = crypto.createHash('md5').update(USERNAME).digest("hex").substr(0, 6);
  
  User.findOne({username: USERNAME}, function(err, user){
    if(err){
      res.json({error: err});
      return;
    }
    
    if(user == null){
      var newUser = new User({username: USERNAME, userId: USERID, count: 0});
      newUser.save(function(err, result){
        if(err){
          res.json({error: err});
          return;
        }
        res.json({username: USERNAME, userId: USERID});
      });
      
    } else {
      res.json({error: "Username is already taken"});
    }
  });
})

// Update user exercise log entry
app.post("/api/exercise/add", function(req, res){
  const USERID = req.body.userId;
  const DESCRIPTION = req.body.description;
  const DURATION = req.body.duration;
  const DATE = req.body.date;
  const DATE_REGEX = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/;
  
  if(isNaN(DURATION)){
    res.json({error: "Invalid input. Duration must be a number"})
  } else if(!DATE_REGEX.test(DATE)){
    res.json({error: "Invalid input. Date must be in yyyy-mm-dd format"})
  } else {
    const LOGENTRY = {description: DESCRIPTION, duration: DURATION, date: new Date(DATE)};
    User.findOneAndUpdate({userId: USERID}, {$inc: {count: 1 }, $push: {log: LOGENTRY}}, {new: true}, function(err, user){
      if(err){
        res.json({error: err});
        return;
      } else if(user == null){
        res.json({error: "User does not exist"});
        return;
      } else {
        res.json({username: user.username, userId: user.userId, count: user.count, log: LOGENTRY});
      }
    })
  }
})
        
// === Do not write any middleware below this line ===
// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
