/*
*
*
*       Complete the handler logic below
*       
*       
*/

function ConvertHandler() {
  
  //Get value of query
  this.getNum = function(input) {
    var number_regex = input.match(/[0-9.\/]+/);
    var number_string;
    var number;
    
    if(!number_regex){
      number_string = [1];
    } else {
      number_string = number_regex[0].split('/');
    }
    
    if(number_string.length == 2) {
      if(parseFloat(number_string[1], 10) != 0) {
        number = parseFloat(number_string[0], 10) / parseFloat(number_string[1], 10);
      } else {
        number = 'invalid number';
      }
    } else if(number_string.length == 1) {
      number = parseFloat(number_string[0], 10);
    } else {
      number = 'invalid number';
    }
    
    return number;
  };
  
  //Get unit of query
  this.getUnit = function(input) {
    var units = ['gal', 'L', 'lbs', 'kg', 'mi', 'km'];
    var unit_regex = input.match(/[a-z]+/i);
    var unit;
    
    if(!unit_regex) {
      unit = 'null';
    } else {
      unit = unit_regex[0];
    }
      
    //If unit is L, retain capital letter
    if(unit != units[1]) {
      unit = unit.toString().toLowerCase();
      if(unit == 'l'){
        unit = unit.toString().toUpperCase();
      }
    }
    
    if(!units.includes(unit)){
      unit = 'invalid unit';
    }
    
    return unit;
  };    
  
  this.getReturnUnit = function(initUnit) {
    const converter = {
      gal: 'L', 
      L: 'gal', 
      lbs: 'kg', 
      kg: 'lbs', 
      mi: 'km', 
      km: 'mi', 
    };
    Object.freeze(converter);
    var returned_unit = converter[initUnit];
    
    return returned_unit;
  };

  this.spellOutUnit = function(num, unit) {
    const converter = {
      gal: 'gallon', 
      L: 'liter', 
      lbs: 'pound', 
      kg: 'kilogram', 
      mi: 'mile', 
      km: 'kilometer',
    };
    Object.freeze(converter);
    var spelled_unit = (num == 1)? converter[unit] : converter[unit] + 's';
    
    return spelled_unit;
  };
  
  //Unit converter
  this.convert = function(initNum, initUnit) {
    const converter = {
      gal: {value: 3.78541, operator: '*'}, 
      L: {value: 3.78541, operator: '/'}, 
      lbs: {value: 0.453592, operator: '*'}, 
      kg: {value: 0.453592, operator: '/'}, 
      mi: {value: 1.60934, operator: '*'}, 
      km: {value: 1.60934, operator: '/'}, 
    };
    Object.freeze(converter);
    var converted_number;

    if(converter[initUnit].operator == '*'){
      converted_number = initNum * converter[initUnit].value;
    } else {
      converted_number = initNum / converter[initUnit].value;
    }

    return converted_number;
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    var init_full = this.spellOutUnit(initNum, initUnit);
    var return_full = this.spellOutUnit(returnNum, returnUnit);
    var return_string = this.roundNumber(initNum, 5) + ' ' + init_full + ' converts to ' + this.roundNumber(returnNum, 5) + ' ' + return_full;
    
    return return_string;
  };
  
  this.roundNumber = function roundNumber(num, scale) {
    if(!("" + num).includes("e")) {
      return +(Math.round(num + "e+" + scale)  + "e-" + scale);
    } else {
      var arr = ("" + num).split("e");
      var sig = ""
      if(+arr[1] + scale > 0) {
        sig = "+";
      }
      return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
    }
  }
  
}

module.exports = ConvertHandler;
