'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res, next) => {
      const puzzle = req.body.puzzle || '';
      const coordinate = req.body.coordinate || '';
      const value = req.body.value  || '';
      // check missing field
      if (puzzle.length * value.length * coordinate.length == 0) {
        res.json({ error: 'Required field(s) missing' });
        return next();
      }
      // convert coordinate input to 0-8 range
      let [row, ...col] = [...coordinate];
      row = ('abcdefghi').indexOf(row.toLowerCase());
      col--;
      // validate input
      try {
        solver.validate(puzzle);
        solver.validateInput(row, col, value);
      } catch(e) {
        res.json({ error: e.message });
        return next();
      }
      // checking value placement
      let conflict = [];
      if (!solver.checkRowPlacement(puzzle, row, col, value)) {
        conflict.push('row');
      }
      if (!solver.checkColPlacement(puzzle, row, col, value)) {
        conflict.push('column');
      }
      if (!solver.checkRegionPlacement(puzzle, row, col, value)) {
        conflict.push('region');
      }
      if (conflict.length != 0) {
        res.json({ valid: false, conflict: conflict });
      } else {
        res.json({ valid: true });
      }
    });
    
  app.route('/api/solve')
    .post((req, res, next) => {
      const puzzle = req.body.puzzle || '';
      if (puzzle === '') {
        res.json({ error: 'Required field missing' });
        return next();
      }
      try {
        const solution = solver.solve(puzzle);
        res.json({ solution: solution });
      } catch(e) {
        res.json({ error: e.message });
      }
    });
};
