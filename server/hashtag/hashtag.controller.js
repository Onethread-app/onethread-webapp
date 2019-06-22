const Hashtag = require("./hashtag.model");


function create(req, res, next) {  
  
  const hashtag = new Hashtag({
    text: req.body.text
  });

  hashtag 
    .save()
    .then(result => res.send(result))
    .catch(e => next(e));
}

 function suggest(req, res) {   //search suggest
  const { text = ''} = req.query;
 
  Hashtag.find({text: { '$regex' : '^'+text, '$options' : 'i' } }) //minimum text 2
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

module.exports = { create, suggest };
