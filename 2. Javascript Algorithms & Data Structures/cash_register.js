function checkCashRegister(price, cash, cid) {
  var statusArr = ["OPEN", "CLOSED", "INSUFFICIENT_FUNDS"];
  var currencyArr = [10, 50, 100, 250, 1000, 5000, 10000, 20000, 100000];
  var currencyNameArr = ["PENNY","NICKEL","DIME","QUARTER","ONE","FIVE","TEN","TWENTY","ONE HUNDRED"]
  var availCash = [];
  var availCash_sum = 0;
  var reqChange = (cash - price)*1000;
  var result = 0;

  var register = {
    status: "OPEN",
    change: []
  };

  //Finding total cash in drawer
  for(var x in cid){
    availCash.push(cid[x][1]*1000);
  }

  //Calculate change
  function calChange(){
    for(var y=currencyArr.length-1; y>=0; y--){
      result = 0;
      while(reqChange/currencyArr[y] >=1 && availCash[y] > 0){
        reqChange = reqChange - currencyArr[y];
        availCash[y] = availCash[y] - currencyArr[y];
        result = result + currencyArr[y]
      }
      if(result > 0 || register.status == "CLOSED"){
        register.change.push([currencyNameArr[y], (result/1000)]);
      }
    }
  }

  calChange();

  for(var z in availCash){
    availCash_sum = availCash_sum + availCash[z];
  } 

  if(reqChange == 0 && availCash_sum == 0){
    register.status = statusArr[1];
    register.change = cid;
  } else if(reqChange == 0 && availCash_sum > 0){
    register.status = statusArr[0];
  } else {
    register.status = statusArr[2];
    register.change = [];
  }
  
  return register;
}

console.log(checkCashRegister(19.5, 20, [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]));
