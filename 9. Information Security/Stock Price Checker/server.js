'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var expect      = require('chai').expect;
var cors        = require('cors');
var mongo       = require('mongodb').MongoClient;
var pug         = require('pug');

var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');

var helmet = require('helmet');
var uuidv4 = require('uuid/v4')

var app = express();

app.set('view engine', 'pug');

app.use(helmet());

app.use(function (req, res, next) {
  res.locals.nonce = uuidv4()
  next()
})


app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "https://hyperdev.com"],
    scriptSrc: [(req, res) => `'nonce-${res.locals.nonce}'`, "'unsafe-inline'"],
    objectSrc: ["'none'"],
    fontSrc: ["'self'", 'data:'],
    reportUri: '/report-violation',
    baseUri: ["'none'"]
  }
}));

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({
  type: ['json', 'application/csp-report']
}))

app.post('/report-violation', (req, res) => {
  if (req.body) {
    console.log('CSP Violation: ', req.body)
  } else {
    console.log('CSP Violation: No data received!')
  }
  res.status(204).end()
})

mongo.connect(process.env.DB, function(err, client){

  //Index page (static HTML)
  app.route('/')
    .get(function (req, res) {
      res.render('index', {nonce: res.locals.nonce});
    });

  //For FCC testing purposes
  fccTestingRoutes(app, client);

  //Routing for API 
  apiRoutes(app, client);  

  //404 Not Found Middleware
  app.use(function(req, res, next) {
    res.status(404)
      .type('text')
      .send('Not Found');
  });

  //Start our server and tests!
  app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port " + process.env.PORT);
    if(process.env.NODE_ENV==='test') {
      console.log('Running Tests...');
      setTimeout(function () {
        try {
          runner.run();
        } catch(e) {
          var error = e;
            console.log('Tests are not valid:');
            console.log(error);
        }
      }, 3500);
    }
  });

  module.exports = app; //for testing

});