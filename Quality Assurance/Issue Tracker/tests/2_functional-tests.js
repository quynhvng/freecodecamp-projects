const chaiHttp = require('chai-http');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const modelDoc = {
  project: 'test',
  _id: '5871dda29faedc3491ff93bb',
  issue_title: 'Fix error in posting data',
  issue_text: 'When we post data it has an error.',
  created_on: '2017-01-08T06:35:14.240Z',
  updated_on: '2017-01-08T06:35:14.240Z',
  created_by: 'Joe',
  assigned_to: 'Joe',
  open: true,
  status_text: 'In QA',
  __v: 0
};

suite('Functional Tests', function () {
  this.timeout(5000);
  let currentDocs = [];
  // #1
  test('POST all field', function (done) {
    chai.request(server)
      .post('/api/issues/test')
      .type('form')
      .send({
        issue_title: 'test',
        issue_text: 'test',
        created_by: 'john',
        assigned_to: 'joe',
        status_text: 'status'
      })
      .end(function (err, res) {
        if (err) return console.log(err);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        assert.hasAllKeys(res.body, modelDoc);
        for (const [key, val] of Object.entries(res.body)) {
          if (key == '__v') {
            continue;
          } else {
            assert.isOk(val);
          }
        };
        currentDocs.push(res.body);
        done();
      })
  })
  // #2
  test('POST required field', function (done) {
    chai.request(server)
      .post('/api/issues/test')
      .type('form')
      .send({
        issue_title: 'test',
        issue_text: 'test',
        created_by: 'jess'
      })
      .end(function (err, res) {
        if (err) return console.log(err);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        assert.hasAllKeys(res.body, modelDoc);
        for (const [key, val] of Object.entries(res.body)) {
          if (key == '__v') {
            continue;
          } else if (['assigned_to', 'status_text'].includes(key)) {
            assert.isNotOk(val);
          } else {
            assert.isOk(val);
          }
        };
        currentDocs.push(res.body);
        done();
      })
  })
  // #3
  test('POST missing required field', function (done) {
    chai.request(server)
      .post('/api/issues/test')
      .type('form')
      .send({
        issue_title: 'test',
        issue_text: 'test'
      })
      .end(function (err, res) {
        if (err) return console.log(err);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        assert.deepEqual(res.body, { error: 'required field(s) missing' });
        done();
      })
  })
  // #4
  test('GET project', function (done) {
    chai.request(server)
      .get('/api/issues/test')
      .end(function (err, res) {
        if (err) return console.log(err);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        assert.deepEqual(res.body, currentDocs);
        done();
      })
  })
  // #5
  test('GET issue, 1 filter', function (done) {
    chai.request(server)
      .get('/api/issues/test?assigned_to=joe')
      .end(function (err, res) {
        if (err) return console.log(err);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        assert.deepEqual(res.body, currentDocs.filter(o => o.assigned_to == 'joe'));
        done();
      })
  })
  // #6
  test('GET issue, n filter', function (done) {
    chai.request(server)
      .get('/api/issues/test?open=true&created_by=jess&issue_title=test')
      .end(function (err, res) {
        if (err) return console.log(err);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        assert.deepEqual(res.body, currentDocs.filter(
          o => o.open == true && o.created_by == 'jess' && o.issue_title == 'test'
        ));
        done();
      })
  })
  // #7
  test('PUT issue, 1 field', function (done) {
    const doc = currentDocs[0];
    chai.request(server)
      .put('/api/issues/test')
      .type('form')
      .send({
        _id: doc._id,
        issue_text: 'changed'
      })
      .end(function (err, res) {
        if (err) return console.log(err);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        assert.deepEqual(res.body, {
          result: 'successfully updated',
          _id: doc._id
        });
        done();
      })
  })
  // #8
  test('PUT issue, n field', function (done) {
    const doc = currentDocs[1];
    chai.request(server)
      .put('/api/issues/test')
      .type('form')
      .send({
        _id: doc._id,
        issue_text: 'changed',
        open: false
      })
      .end(function (err, res) {
        if (err) return console.log(err);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        assert.deepEqual(res.body, {
          result: 'successfully updated',
          _id: doc._id
        });
        done();
      })
  })
  // #9
  test('PUT issue, missing _id', function (done) {
    chai.request(server)
      .put('/api/issues/test')
      .type('form')
      .send({
        issue_text: 'changed'
      })
      .end(function (err, res) {
        if (err) return console.log(err);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        assert.deepEqual(res.body, {
          error: 'missing _id'
        });
        done();
      })
  })
  // #10
  test('PUT issue, no field', function (done) {
    const doc = currentDocs[0];
    chai.request(server)
      .put('/api/issues/test')
      .type('form')
      .send({
        _id: doc._id
      })
      .end(function (err, res) {
        if (err) return console.log(err);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        assert.deepEqual(res.body, {
          error: 'no update field(s) sent',
          _id: doc._id
        });
        done();
      })
  })
  // #11
  test('PUT issue, invalid _id', function (done) {
    chai.request(server)
      .put('/api/issues/test')
      .type('form')
      .send({
        _id: 'a123',
        open: false
      })
      .end(function (err, res) {
        if (err) return console.log(err);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        assert.deepEqual(res.body, {
          error: 'could not update',
          _id: 'a123'
        });
        done();
      })
  })
  // #12
  test('DELETE issue', function (done) {
    chai.request(server)
      .delete('/api/issues/test')
      .type('form')
      .send({
        _id: currentDocs[0]._id
      })
      .end(function (err, res) {
        if (err) return console.log(err);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        assert.deepEqual(res.body, {
          result: 'successfully deleted',
          _id: currentDocs[0]._id
        });
        chai.request(server)
          .delete('/api/issues/test')
          .type('form')
          .send({
            _id: currentDocs[1]._id
          })
          .end(function (err, res) {
            if (err) return console.log(err);
            expect(res).to.have.status(200);
            done();
          })
      })
  })
  // #13
  test('DELETE issue, invalid _id', function (done) {
    chai.request(server)
      .delete('/api/issues/test')
      .type('form')
      .send({
        _id: 'a123'
      })
      .end(function (err, res) {
        if (err) return console.log(err);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        assert.deepEqual(res.body, {
          error: 'could not delete',
          _id: 'a123'
        });
        done();
      })
  })
  // #14
  test('DELETE issue, missing _id', function (done) {
    chai.request(server)
      .delete('/api/issues/test')
      .type('form')
      .send({})
      .end(function (err, res) {
        if (err) return console.log(err);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        assert.deepEqual(res.body, {
          error: 'missing _id'
        });
        done();
      })
  })
});
