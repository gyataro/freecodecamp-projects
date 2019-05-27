'use strict';

// Node.js framework
var express = require('express');

// Database
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// DNS module
var dns = require('dns');

// URL to hash crypto module
var crypto = require('crypto');

// CORS security module
var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
app.use(cors());

var UrlKeySchema = new mongoose.Schema({
  original_url: String,
  url_key: String,
});

var UrlKey = mongoose.model('UrlKey', UrlKeySchema);

// Mounting body-parser
app.use(bodyParser.urlencoded({ extended: false}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get("/api/shorturl/:url_key", function(req, res){
  UrlKey.findOne({url_key: req.params.url_key}, function(error, data){
    if(error) console.log(error);
    res.redirect(data.original_url);
  });
});

app.post("/api/shorturl/new", function (req, res) {
  const URL_REGEX = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
  
  // Check if input is a valid URL format via regex expression
  if(URL_REGEX.test(req.body.url)){
    
    // Parse input into URL object
    const INPUT_URL = new URL(req.body.url);
    
    dns.lookup(INPUT_URL.hostname, function(error, address, family){
      if(error == null){
        const OUTPUT_URL = (INPUT_URL.pathname == '/')? INPUT_URL.origin : INPUT_URL.href;
        const OUTPUT_HASH = crypto.createHash('md5').update(OUTPUT_URL).digest("hex").substr(0, 6);
        
        UrlKey.findOne({url_key: OUTPUT_HASH}, function(error, data){
          if(error){
            console.log(error);
            res.json({original_url: error});
          }
          
          // Only save the key if it doesnt exist in the database
          if(data == null){
            UrlKey.create({original_url: OUTPUT_URL, url_key: OUTPUT_HASH}, function(error, small){
              if (error){
                console.log(error);
                res.json({original_url: error});
              }
              console.log("Saved!");
              res.json({original_url: OUTPUT_URL, short_url: OUTPUT_HASH});
            });
          } else {
            res.json({original_url: OUTPUT_URL, short_url: OUTPUT_HASH});
            
          }
        });
        
      } else {
        res.json({original_url: "invalid Hostname"});
        
      }
    });
    
    
  } else {
    res.json({error: "invalid URL"});
  }
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});