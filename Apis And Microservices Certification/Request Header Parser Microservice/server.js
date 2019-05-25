// init project
var express = require('express');
var app = express();
app.enable('trust proxy');

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

// API endpoint... 
app.get("/api/whoami", function (req, res) {
  console.log(JSON.stringify(req.headers));
  res.json({ipaddress: req.ip, language: req.headers['accept-language'], software: req.headers['user-agent']});
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Listening on port ' + listener.address().port);
});
