function rot13(str) {
  /* Return the string encoded using ROT13 cipher method. Non alphabet characters in the string
  are left unchanged. */
  function rot13Char(char) {
    // Rotate an alphabet character by 13 places.
    const lib = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const boundary = lib.length;
    const encodedIndex = (lib.indexOf(char) + 13) % boundary;
    return lib[encodedIndex];
  }
  let encodedStr = str.replace(/[A-Z]/g, char => rot13Char(char));
  return encodedStr;
}

rot13("SERR PBQR PNZC");