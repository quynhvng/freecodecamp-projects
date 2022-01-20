function convertToRoman(num) {
  // Convert arabic numeral to roman numeral.
  
  // Define basic roman numeral characters.
  const lookup = {
    1: "I",
    5: "V",
    10: "X",
    50: "L",
    100: "C",
    500: "D",
    1000: "M"
  }
  let roman = "";
  
  // Convert to roman digit-by-digit from right to left.
  const numParts = breakDown(num);
  for (let i in numParts) {
    const part = numParts[i];
    const unit = 10 ** i;
    let romanPart = "";

    if (lookup[part]) {
      romanPart = lookup[part];
    }
    else if (part != 0) {
      const diff = part / unit - 5;
      switch (diff) {
        case -3:
        case -2:
          romanPart = Array(5 + diff).fill(lookup[unit]).join("");
          break;
        case -1:
          romanPart = lookup[unit] + lookup[5 * unit];
          break;
        case 1:
        case 2:
        case 3:
          romanPart = lookup[5 * unit] + Array(diff).fill(lookup[unit]).join("");
          break;
        case 4:
          romanPart = lookup[unit] + lookup[10 * unit];
          break;
      }
    }
    else continue;
    roman = romanPart + roman;
  }

  return roman;
}

function breakDown(num) {
  /* Break down an arabic numeral. Return an array of their weighted digits in ascending order
  (digits from right to left). */
  let arr = [];
  let i = 0;
  while (num >= 10**i) {
    const part = num % 10**(i+1) - num % 10**i;
    arr.push(part);
    i++;
  }
  return arr;
}

convertToRoman(68);