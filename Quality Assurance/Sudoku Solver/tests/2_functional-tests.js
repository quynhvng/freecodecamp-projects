const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const puzzles = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;
const unsolvable = '2..9............6......1...5.26..4.7.....41......98.23.....3.8...5.1......7......';

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(2000);
  
  suite('Solving puzzle', () => {
    test('Valid puzzle', (done) => {
      chai.request(server)
        .post('/api/solve')
        .type('form')
        .send({ puzzle: puzzles[0][0] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.solution, puzzles[0][1]);
          done();
        })
    })

    test('Missing puzzle', (done) => {
      chai.request(server)
        .post('/api/solve')
        .type('form')
        .send({ puzzle: '' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field missing');
          done();
        })
    })

    test('Puzzle with invalid character(s)', (done) => {
      chai.request(server)
        .post('/api/solve')
        .type('form')
        .send({ puzzle: ('ddd').padEnd(81, '.') })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        })
    })

    test('Incorrect length puzzle', (done) => {
      chai.request(server)
        .post('/api/solve')
        .type('form')
        .send({ puzzle: '4...21' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        })
    })

    test('Unsolvable puzzle', (done) => {
      chai.request(server)
        .post('/api/solve')
        .type('form')
        .send({ puzzle: unsolvable })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        })
    })
  })
  suite('Checking puzzle placement', () => {
    test('Valid input', (done) => {
      chai.request(server)
        .post('/api/check')
        .type('form')
        .send({
          puzzle: puzzles[0][0],
          coordinate: 'a2',
          value: 3
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isTrue(res.body.valid);
          done();
        })
    })

    test('Single placement conflict', (done) => {
      chai.request(server)
        .post('/api/check')
        .type('form')
        .send({
          puzzle: puzzles[0][0],
          coordinate: 'a2',
          value: 8
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.conflict.length, 1);
          done();
        })
    })

    test('Multiple placement conflict', (done) => {
      chai.request(server)
        .post('/api/check')
        .type('form')
        .send({
          puzzle: puzzles[0][0],
          coordinate: 'a2',
          value: 5
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.conflict.length, 2);
          done();
        })
    })

    test('All placement conflict', (done) => {
      chai.request(server)
        .post('/api/check')
        .type('form')
        .send({
          puzzle: puzzles[0][0],
          coordinate: 'a2',
          value: 2
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.conflict.length, 3);
          done();
        })
    })

    test('Missing required field(s)', (done) => {
      chai.request(server)
        .post('/api/check')
        .type('form')
        .send({
          puzzle: '',
          coordinate: 'a2'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        })
    })

    test('Invalid characters in puzzle', (done) => {
      chai.request(server)
        .post('/api/check')
        .type('form')
        .send({
          puzzle: 'sss'.padEnd(81, '.'),
          coordinate: 'a2',
          value: 8
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        })
    })

    test('Invalid length puzzle', (done) => {
      chai.request(server)
        .post('/api/check')
        .type('form')
        .send({
          puzzle: '81....2',
          coordinate: 'a2',
          value: 8
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        })
    })

    test('Invalid placement coordinate', (done) => {
      chai.request(server)
        .post('/api/check')
        .type('form')
        .send({
          puzzle: puzzles[0][0],
          coordinate: 'k2',
          value: 8
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        })
    })

    test('Invalid placement value', (done) => {
      chai.request(server)
        .post('/api/check')
        .type('form')
        .send({
          puzzle: puzzles[0][0],
          coordinate: 'a2',
          value: 'j'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid value');
          done();
        })
    })
  })
});

