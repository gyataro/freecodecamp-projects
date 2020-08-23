function palindrome(str) {
  var word_inversed = "";
  var word = str.toLowerCase().replace(/[^(a-z)(0-9)|\(|\)]/ig, "").replace(/\(|\)/ig, "");
  for(var x=word.length-1; x>=0; x--){
    word_inversed = word_inversed + word[x];
  }
  console.log(word);
  console.log(word_inversed);
  if(word_inversed == word){
    return true;
  }
  return false;
}



console.log(palindrome("0_0 (: /-\ :) 0-0"));
