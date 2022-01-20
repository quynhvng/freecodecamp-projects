'use strict';

require('mongodb');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

const issueSchema = new mongoose.Schema({
  project: { type: String, required: true },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: { type: Date, default: () => new Date().toISOString() },
  updated_on: { type: Date, default: () => new Date().toISOString() },
  created_by: { type: String, required: true },
  assigned_to: { type: String, default: '' },
  open: { type: Boolean, default: true },
  status_text: { type: String, default: '' },
});
const Issue = new mongoose.model('Issue', issueSchema);

// clear test data, to reset test in case of failures
//Issue.deleteMany({ project: 'test' }).exec();

module.exports = function (app) {

  app.route('/api/issues/:project')
    // middlewares for issue-related CRUD only

    .get(function (req, res, next) {
      const project = req.params.project;
      let queries = req.query;
      queries.project = project;

      Issue.find(queries, function (err, docs) {
        if (err) return next(err);
        res.json(docs);
      });
    })
    
    .post(function (req, res, next) {
      const project = req.params.project;
      let doc = req.body;
      doc.project = project;
      if (!(doc.issue_title && doc.issue_text && doc.created_by)) {
        res.json({ error: 'required field(s) missing' });
        return next();
      }
      Issue.create(doc, function (err, newdoc) {
        if (err) return next(err);
        res.json(newdoc);
      })
    })
    
    .put(function (req, res, next) {
      //const project = req.params.project; //flat schema, no need
      let doc = {};
      // filter fields that are string
      Object.keys(req.body).forEach(k => {
        if (req.body[k] != '' && typeof req.body[k] === 'string') {
          doc[k] = req.body[k];
        }
      })
      let {_id, ...update} = doc;
      if (Object.keys(update).length == 0 && _id) {
        res.json({ error: 'no update field(s) sent', _id });
        return next();
      } else if (!_id) {
        res.json({ error: 'missing _id' });
        return next();
      }
      update.updated_on = new Date().toISOString();
      Issue.findByIdAndUpdate(_id, update, { new: true }, function (err, newdoc) {
        if (!err && newdoc) {
          res.json({ result: 'successfully updated', _id });
          return next();
        } else {
          res.json({ error: 'could not update', _id });
          return next();
        }
      })
    })
    
    .delete(function (req, res, next){
      //const project = req.params.project; //flat schema, no need
      const _id = req.body._id;
      if (!_id) {
        res.json({ error: 'missing _id' });
        return next();
      }
      Issue.findByIdAndDelete(_id, function (err, doc) {
        if (!err && doc) {
          res.json({ result: 'successfully deleted', _id });
          return next();
        } else {
          res.json({ error: 'could not delete', _id });
          return next();
        }
      })
    })
    
};
