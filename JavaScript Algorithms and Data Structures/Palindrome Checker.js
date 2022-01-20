function palindrome(str) {
  // Return true if the given string is a palindrome. Return false otherwise.
  const copy = strip(str.toLowerCase());
  let flipped = "";
  for (let i in copy) {
    flipped = copy[i] + flipped;
  }
  return copy === flipped;
}

function strip(str) {
  // Remove non-word characters and underscores from given string.
  const regex = /[\W_]*/g;
  return str.replace(regex, "");
}

palindrome("_eye");