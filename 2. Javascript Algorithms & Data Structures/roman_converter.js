function convertToRoman(num) {
  var target = num;
  var result = "";
  const DECIMAL = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const ROMAN = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
  for(var x=0; x < DECIMAL.length; x++){
    while((target - DECIMAL[x]) >= 0){
      console.log("done once")
      target = target - DECIMAL[x];
      result = result + ROMAN[x];
    }
  }

  return result;
}

console.log(convertToRoman(421));
