// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/timestamp/:date_string?", function (req, res) {
  var input = req.params.date_string;
  const text_regex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
  const num_regex = /^\d+$/;
  if(!input){
    res.json({unix: Date.now(), utc: new Date(Date.now()).toUTCString()});
    
  }else if(num_regex.test(input) == true){
    input = parseInt(input, 10)*1000; // The input is initially a string
    console.log(input);
    res.json({unix: input, utc: new Date(input).toUTCString()});
    
  }else(res.json({unix: new Date(input).getTime(), utc: new Date(input).toUTCString()}));
});

// listen for requests
var listener = app.listen(process.env.PORT, function () {
  console.log('Listening on port ' + listener.address().port);
});
