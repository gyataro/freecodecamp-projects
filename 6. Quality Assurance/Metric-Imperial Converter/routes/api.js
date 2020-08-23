/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  var convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get(function (req, res){
      var error;
      var input = req.query.input;
      var initNum = convertHandler.getNum(input);
      var initUnit = convertHandler.getUnit(input);
    
      if(initNum == 'invalid number'){
        error = initNum;
        if(initUnit == 'invalid unit'){
          error = error + ' and unit';
        }
      } else if(initUnit == 'invalid unit'){
        error = initUnit;
      }
    
      if(error){
        res.json(error);
        return;
      }
    
      var returnNum = convertHandler.convert(initNum, initUnit);
      var returnUnit = convertHandler.getReturnUnit(initUnit);
      var toString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);
    
      res.json({initNum: convertHandler.roundNumber(initNum, 5), initUnit: initUnit, returnNum: convertHandler.roundNumber(returnNum, 5), returnUnit: returnUnit, string: toString});
    });
    
};
