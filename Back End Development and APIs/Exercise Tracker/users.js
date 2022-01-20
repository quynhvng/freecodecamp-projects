const express = require('express');
const router = express.Router();

// for course completion purpose only
// the data is saved only when the server is running
var data = [];

// home route, add a new user
router
.route('/')
.get(function (req, res) {
  res.send(data);
})
.post(function (req, res) {
  const id = idGen() + idGen();
  const user = {
    username: req.body.username,
    _id: id
  };
  data.push(user);
  res.json(user);
})

function idGen() {
  return Math.random().toString(16).slice(2);
}

// exercise route, add an exercise
router
.route('/:_id/exercises')
.post(function (req, res, next) {
  const user = data.find(u => u._id == req.params._id);
  if (!user) next();

  let date = new Date(req.body.date);
  if (date.toString() == "Invalid Date") {
    date = new Date();
  }
  let exercise = {
    description: req.body.description,
    duration: Number(req.body.duration),
    date: date.toDateString()
  };
  user.exercises
  ? user.exercises.push(exercise)
  : user.exercises = [exercise];

  res.json({
    username: user.username,
    ...exercise,
    _id: user._id
  });
})

// log route, log query
router
.route('/:_id/logs?')
.get(function (req, res, next) {
  const user = data.find(u => u._id == req.params._id);
  if (!user) next();

  let log = [];

  if (req.query != {} && user.exercises) {
    log = [...user.exercises];
    const fromDate = new Date(req.query.from);
    const toDate = new Date(req.query.to);

    if (fromDate.toString() != "Invalid Date") {
      log = log.filter(e => new Date(e.date) >= fromDate);
    }
    if (toDate.toString() != "Invalid Date") {
      log = log.filter(e => new Date(e.date) <= toDate);
    }
    if (req.query.limit) {
      log = log.slice(0, req.query.limit);
    }
  }
  const response = {
    username: user.username,
    count: user.exercises ? user.exercises.length : 0,
    _id: user._id,
    log: log
  }
  res.json(response);
})

module.exports = router;