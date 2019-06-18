'use strict';

const comment = require("./comment.model");

function load(req, res, next, id) {
  comment.findById(id)
    .exec()
    .then(result => {
      if (result) {
        req.comment = result;
        return next();
      } else {
        return res
          .status(400)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      // console.log(err);
      next(err);
    });
}

function get(req, res) {
  return res.json(req.comment);
}

function create(req, res) {
  const comment = new Comment({
    text: req.body.text,
    postRef: req.body.postRef,
    account: req.user
  });

  comment
    .save()
    .then(result => res.send(result))
    .catch(e => console.log(e));
}

function list(req, res) {
  const { limit = 50, skip = 0 } = req.query;
  Comment.find()
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec(function(err, result) {
      if (err) {
        return res.status(422).send({
          message: err
        });
      } else {
        res.json(result);
      }
    });
}

function tag(req, res, next) {

  const id = req.params.commentId;
  
 
  Comment.findByIdAndUpdate(id,  {$push: {tag : '5cdb98cdab24ca4b10407752'}}, {
    new: true } )
   .then(result => {
     
     if (result) {
      res.json(result);
    }  else {
      return res.status(400)
        .json({ message: "No valid entry found for provided ID" });
     }
   })
   .catch(err => {
     // console.log(err);
     next(err);
   });
}

function like(req, res, next) {

  const id = req.params.commentId;
  
 
  Comment.findByIdAndUpdate(id,  {$push: {like : '5cdb98cdab24ca4b10407752'}}, {
    new: true } )
   .then(result => {
     
     if (result) {
      res.json(result);
    }  else {
      return res.status(400)
        .json({ message: "No valid entry found for provided ID" });
     }
   })
   .catch(err => {
     // console.log(err);
     next(err);
   });
}

function respect(req, res, next) {

  const id = req.params.commentId;
  
 
  Comment.findByIdAndUpdate(id,  {$push: {respect : '5cdb98cdab24ca4b10407752'}}, {
    new: true } )
   .then(result => {
     
     if (result) {
      res.json(result);
    }  else {
      return res.status(400)
        .json({ message: "No valid entry found for provided ID" });
     }
   })
   .catch(err => {
     // console.log(err);
     next(err);
   });
}

function remove(req, res, next) {
  const comment = req.comment;
  comment
    .remove()
    .then(result => res.json(result))
    .catch(e => next(e));
}

module.exports = { create, get, load, remove, list, tag, like, respect };
