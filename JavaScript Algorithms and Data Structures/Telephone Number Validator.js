function telephoneCheck(str) {
  // Return True if given string is of valid telephone number format. Return False otherwise.
  
  // Check for invalid characters:
  let symbolCheck = /[^\d ()-]/.test(str);
  if (symbolCheck) return false;
  
  // Check for number of digits:
  let numCount = str.match(/\d+/g).join("").length;
  if (numCount != 10 && numCount != 11) return false;
  
  // Format checks:
  // e.g. 5555555555, 555-555-5555, (555) 555-5555
  let regex10 = /^\d{10}$|^\d{3}[ -]\d{3}[ -]\d{4}$|^\(\d{3}\) ?\d{3}[ -]\d{4}$/;
  if (numCount == 10 && regex10.test(str)) return true;
  // with country code 1
  let regex11 = /^1 \d{3}[ -]\d{3}[ -]\d{4}$|^1 ?\(\d{3}\) ?\d{3}[ -]\d{4}$/;
  if (numCount == 11 && regex11.test(str)) return true;

  return false;
}

telephoneCheck("(555) 555 5555");