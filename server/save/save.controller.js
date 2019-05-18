const Save = require('./save.model');

function load(req, res, next, id) {

  Save.findById(id)
   .exec()
   .then(result => {
     
     if (result) {
      req.post = result;
      return next();
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

function create(req, res, next) {
  
  const save = new Save({
    postRef: req.body.postRef,
  });

  save.save()
    .then(result => res.send(result))
    .catch(e => next(e));
}



 
module.exports = { load, create };
