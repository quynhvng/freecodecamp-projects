function checkCashRegister(price, cash, cid) {
  let value = {
    100: "ONE HUNDRED",
    20: "TWENTY",
    10: "TEN",
    5: "FIVE",
    1: "ONE",
    0.25: "QUARTER",
    0.1: "DIME",
    0.05: "NICKEL",
    0.01: "PENNY"
  }

  let cidObj = Object.fromEntries(cid);
  function cidTotal() {
    // Return the current total amount in drawer.
    let current = Object.entries(cidObj);
    let sum = current.reduce((sum, x)  => sum + x[1] * 100, 0); // float precision issues, convert dollars to cents
    return sum / 100;
  }

  let changeSum = cash * 100 - price * 100;
  let change = [];
  let availableChange = Object.keys(value).sort((a, b) => b - a)

  while (changeSum > 0 && cidTotal() > 0) {
    // Get the max face value bill can be used as change.
    let possibleChange = availableChange.filter(c => c < changeSum/100 && cidObj[value[c]] > 0);
    if (possibleChange.length == 0) break;
    let maxUnit = possibleChange[0];
    /* With the bill, compare the max amount the customer can receive and the amount available in drawer to get the actual
    returned amount. */
    let maxPayable = changeSum - changeSum % (maxUnit * 100);
    let cidPayable = cidObj[value[maxUnit]] * 100;
    let paid = Math.min(maxPayable, cidPayable);
    // Put the bill(s) as change, decrease amount in drawer and change remained.
    change.push([value[maxUnit], paid / 100]);
    cidObj[value[maxUnit]] = (cidPayable - paid) / 100;
    changeSum = changeSum - paid;
  }

  let res = {
    status: "",
    change: []
  }
  if (changeSum >= 0.01 || cidTotal() < 0) res.status = "INSUFFICIENT_FUNDS";
  else if (cidTotal() == 0) {
    res.status = "CLOSED";
    res.change = cid;
  }
  else {
    res.status = "OPEN";
    res.change = change;
  }

  return res;
}

checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55],
  ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]])