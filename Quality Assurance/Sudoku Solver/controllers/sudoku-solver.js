class SudokuSolver {
  // size 9x9

  validate(puzzleString) {
    if (typeof puzzleString != 'string') {
      throw new Error('Expected input to be a string');
    }
    if (puzzleString.length != 9 ** 2) {
      throw new Error('Expected puzzle to be 81 characters long');
    }
    if (/[^0-9\.]/.test(puzzleString)) {
      throw new Error('Invalid characters in puzzle');
    }
    return true;
  }

  // row and col notation: 0-8
  validateInput(row, col, value) {
    // force to number
    const r = Number(row);
    const c = Number(col);
    const v = Number(value)
    if (v != v || v < 1 || v > 9) {
      throw new Error('Invalid value');
    }
    if (r != r || c != c || r < 0 || r > 8 || c < 0 || c > 8) {
      throw new Error('Invalid coordinate');
    }
    return true;
  }

  getPosition(index) {
    return { row: Math.floor(index/9), col: index % 9 };
  }

  getIndex(row, col) {
    return row * 9 + col;
  }

  checkRowPlacement(puzzleString, row, col, value) {
    const rowString = puzzleString.substring(row * 9, (row+1) * 9);
    if (rowString.includes(value) && rowString[col] != value) return false;
    return true;
  }

  checkColPlacement(puzzleString, row, col, value) {
    for (let r = 0; r < 9; r++) {
      if (puzzleString[this.getIndex(r, col)] == value && r != row) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, col, value) {
    const regionR = Math.floor(row/3) * 3;
    const regionC = Math.floor(col/3) * 3;
    for (let r = regionR; r < regionR + 3; r++) {
      for (let c = regionC; c < regionC + 3; c++) {
        if (puzzleString[this.getIndex(r, c)] == value && (c != col || r != row)) return false;
      }
    }
    return true;
  }

  getChoices(puzzleString, index) {
    let choices = [];
    let {row, col} = this.getPosition(index);
    for (let n = 1; n < 10; n++) {
      const testRow = this.checkRowPlacement(puzzleString, row, col, n);
      const testCol = this.checkColPlacement(puzzleString, row, col, n);
      const testRegion = this.checkRegionPlacement(puzzleString, row, col, n)
      if (testRow && testCol && testRegion) {
        choices.push(n);
      }
    }
    return choices;
  }

  leastChoices(puzzleString) {
    let index, choices, bestN = 10;
    for (let i = 0; i < 81; i++) {
      if (puzzleString[i] === '.') {
        const c = this.getChoices(puzzleString, i);
        if (c.length == 0) {
          throw new Error('Puzzle cannot be solved');
        } else if (c.length < bestN) {
          bestN = c.length;
          index = i;
          choices = c;
          if (bestN == 1) break;
        }
      }
    }
    return { index, choices };
  }

  // solver helper func
  // !! brute forcing and altering arguments var
  recursive(board) {
    let { index, choices } = this.leastChoices(board.join(''));
    if (index === undefined) return true;
    for (const choice of choices) {
      board[index] = choice;
      if (this.recursive(board)) return true;
    }
    board[index] = '.';
    return false;
  }

  solve(puzzleString) {
    this.validate(puzzleString);
    let board = [...puzzleString];
    if (this.recursive(board)) {
      return board.join('');
    }
    return '';
  }
}

module.exports = SudokuSolver;

