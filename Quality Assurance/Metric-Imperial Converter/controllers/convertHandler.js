function ConvertHandler() {
  const numError = new Error('invalid number');
  const unitError = new Error('invalid unit');
  const units = {
      'gal': 'gallon',
      'l': 'liter',
      'lbs': 'pound',
      'kg': 'kilogram',
      'mi': 'mile',
      'km': 'kilometer'
  };
  
  this.getNum = function(input) {
    // match valid number part of input
    let num = input.match(/^\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)?(?=[a-z]|$)/i);
    if (!num) {
      if ((/^[a-z]/i).test(input)) return 1;
      throw numError;
    }
    num = num[0];
    // evaluate number string, including with fraction, rounded
    const parts = num.split('/');
    num = Number(parts[0]) / (Number(parts[1]) || 1)
    return Number(num.toFixed(5));
  };
  
  this.getUnit = function(input) {
    // match word part of input
    let unit = input.match(/(?<=\d|^)[a-z]+$/i);
    if (!unit) throw unitError;
    unit = unit[0].toLowerCase();
    if (!Object.keys(units).includes(unit)) throw unitError;
    return (unit == 'l') ? 'L' : unit;
  };
  
  this.getReturnUnit = function(initUnit) {
    const returnUnits = {
      'gal': 'L',
      'l': 'gal',
      'lbs': 'kg',
      'kg': 'lbs',
      'mi': 'km',
      'km': 'mi'
    }
    let returnUnit = returnUnits[initUnit.toLowerCase()];
    if (!returnUnit) throw unitError;
    return returnUnit;
  };

  this.spellOutUnit = function(unit) {
    let fullUnit = units[unit.toLowerCase()];
    if (!fullUnit) throw unitError;
    return fullUnit;
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let returnNum = initNum;
    switch (initUnit.toLowerCase()) {
      case 'gal':
        returnNum *= galToL;
        break;
      case 'l':
        returnNum /= galToL;
        break;
      case 'lbs':
        returnNum *= lbsToKg;
        break;
      case 'kg':
        returnNum /= lbsToKg;
        break;
      case 'mi':
        returnNum *= miToKm;
        break;
      case 'km':
        returnNum /= miToKm;
        break;
      default:
        throw unitError;
    }
    return {
      returnNum: Number(returnNum.toFixed(5)),
      returnUnit: this.getReturnUnit(initUnit)
    };
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    initUnit = this.spellOutUnit(initUnit.toLowerCase());
    returnUnit = this.spellOutUnit(returnUnit.toLowerCase());
    initUnit += (initNum == 1) ? '' : 's';
    returnUnit += (returnNum == 1) ? '' : 's';
    return `${initNum} ${initUnit} converts to ${returnNum} ${returnUnit}`;
  };
}

module.exports = ConvertHandler;
