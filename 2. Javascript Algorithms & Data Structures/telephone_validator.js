function telephoneCheck(str) {
  var regex = /((^1|^1-|^1\s)(\d{3}|(\()\d{3}(\)))(-|\s)?\d{3}(-|\s)?\d{4}$)|((^(\()\d{3}(\))|^\d{3})(-|\s)?\d{3}(-|\s)?\d{4}$)/;
  var reg = regex.test(str);
  return reg;
}

console.log(telephoneCheck("555-555-5555"));
