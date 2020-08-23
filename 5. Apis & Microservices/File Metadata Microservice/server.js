'use strict';

var express = require('express');
var cors = require('cors');

// Require and use "multer"
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var remove = require('remove');

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

// Receives file upload and performs analysis
app.post('/api/fileanalyse', upload.single('upfile'), function(req, res){

  if(req.file == undefined){
    res.json({error: "No file detected"});
    return;
  }
  
  const FILE = req.file;

  try {
    remove.removeSync('/uploads');
  } catch (err) {
    
  } finally {
    res.json({filename: FILE.originalname, encoding: FILE.encoding, type: FILE.mimetype, size: FILE.size});
    return;
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
