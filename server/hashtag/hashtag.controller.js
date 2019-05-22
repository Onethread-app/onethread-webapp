const Hashtag = require("./hashtag.model");


function create(tag) {  

  const hashtag = new Hashtag({
    text: tag,
  });

  hashtag 
    .save()
    .then(result => res.send(result))
    .catch(e => next(e));
}

// function suggest(tag) {   //search suggest

//     const hashtag = new Hashtag({
//       text: tag,
//     });
  
//     hashtag 
//       .save()
//       .then(result => res.send(result))
//       .catch(e => next(e));
//   }

module.exports = { create, suggest };
