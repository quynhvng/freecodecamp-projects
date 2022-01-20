const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(5000);
  // #1
  test('Valid input', function (done) {
    chai
      .request(server)
      .get('/api/convert?input=10L')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.string, '10 liters converts to 2.64172 gallons');
        done();
      });
  });
  // #2
  test('Invalid input', function (done) {
    chai
      .request(server)
      .get('/api/convert?input=10g')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'invalid unit');
        done();
      });
  });
  // #3
  test('Invalid number', function (done) {
    chai
      .request(server)
      .get('/api/convert?input=10/33.3/2km')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'invalid number');
        done();
      });
  });
  // #4
  test('Invalid number and unit', function (done) {
    chai
      .request(server)
      .get('/api/convert?input=1.22/2..dm')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'invalid number and unit');
        done();
      });
  });
  // #5
  test('No number', function (done) {
    chai
      .request(server)
      .get('/api/convert?input=L')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.string, '1 liter converts to 0.26417 gallons');
        done();
      });
  });
});
