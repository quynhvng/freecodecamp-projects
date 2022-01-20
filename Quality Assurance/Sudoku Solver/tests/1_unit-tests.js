const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const solver = new Solver();

const puzzles = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;

suite('UnitTests', function() {
  suite('Validate puzzle string', () => {
    test('Valid string', () => {
      assert.isTrue(solver.validate(puzzles[0][0]));
    })
    
    test('Invalid character', () => {
      const str = ('ddd').padEnd(81, '.');
      try {
        solver.validate(str);
      } catch(e) {
        assert.equal(e.message, 'Invalid characters in puzzle');
      }
    })

    test('Invalid puzzle length', () => {
      try {
        solver.validate('4..35..');
      } catch(e) {
        assert.equal(e.message, 'Expected puzzle to be 81 characters long');
      }
    })
  })
  suite('Placement check', () => {
    test('Valid row placement', () => {
      assert.isTrue(solver.checkRowPlacement(puzzles[0][0], 0, 1, 3));
      assert.isTrue(solver.checkRowPlacement(puzzles[0][0], 0, 0, 1));
    })

    test('Invalid row placement', () => {
      assert.isNotTrue(solver.checkRowPlacement(puzzles[0][0], 0, 1, 5));
    })

    test('Valid column placement', () => {
      assert.isTrue(solver.checkColPlacement(puzzles[0][0], 0, 1, 3));
      assert.isTrue(solver.checkColPlacement(puzzles[0][0], 0, 0, 1));
    })

    test('Invalid column placement', () => {
      assert.isNotTrue(solver.checkColPlacement(puzzles[0][0], 0, 1, 2));
    })

    test('Valid region placement', () => {
      assert.isTrue(solver.checkRegionPlacement(puzzles[0][0], 0, 1, 3));
      assert.isTrue(solver.checkRegionPlacement(puzzles[0][0], 0, 0, 1));
    })

    test('Invalid region placement', () => {
      assert.isNotTrue(solver.checkRegionPlacement(puzzles[0][0], 0, 1, 1));
    })
  })
  suite('Solving puzzle', () => {
    test('Valid puzzle string', () => {
      assert.doesNotThrow(() => { solver.solve(puzzles[0][0]) });
    })

    test('Invalid puzzle string', () => {
      try {
        solver.solve('4..35..');
      } catch(e) {
        assert.isNotEmpty(e.message);
      }
    })

    test('Returning correct puzzle solution', () => {
      for (const puzzle of puzzles) {
        assert.equal(solver.solve(puzzle[0]), puzzle[1]);
      }
    })
  })
});
