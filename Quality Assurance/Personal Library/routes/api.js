/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
require('mongodb');
const mongoose = require('mongoose');
mongoose.connect(process.env.DB);

const BookSchema = mongoose.Schema({
  title: { type: String },
  comments: { type: Array, default: [] },
  commentcount: { type: Number, default: 0 }
});
const Book = mongoose.model('Book', BookSchema);


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, function (err, docs) {
        if (!err) res.json(docs);
      })
    })
    
    .post(function (req, res, next){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!(typeof title === 'string' && title.length != 0)) {
        res.send('missing required field title');
        return next();
      }
      Book.create({ title: title }, function (err, doc) {
        if (!err && doc) res.json(doc);
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, function (err) {
        if (!err) res.send('complete delete successful');
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, function (err, doc) {
        if (!err && doc) {
          res.json(doc);
        } else {
          res.send('no book exists');
        }
      })
    })
    
    .post(function(req, res, next){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!(typeof comment === 'string' && comment.length != 0)) {
        res.send('missing required field comment');
        return next();
      }
      Book.findOneAndUpdate({ _id: bookid }, {
        $push: { comments: comment },
        $inc: { commentcount: 1 }
      }, 
        { new: true }, 
        function (err, doc) {
          if (!err && doc) {
            res.json(doc);
            return next();
          } else {
            res.send('no book exists');
            return next();
          }
      })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndDelete(bookid, function (err, doc) {
        if (!err && doc) {
          res.send('delete successful');
        } else {
          res.send('no book exists');
        }
      })
    });
  
};
