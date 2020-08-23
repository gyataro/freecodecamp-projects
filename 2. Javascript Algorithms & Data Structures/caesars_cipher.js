function rot13(str) { 
  var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = "";
  for(var x in str){
    if(alphabet.indexOf(str[x]) >= 0){
      result = result + alphabet[alphabet.indexOf(str[x]) + 13];
    } else {
      result = result + str[x];
    }
  }
  return result;
}

// Change the inputs below to test
console.log(rot13("SERR CVMMN!"));
 
