const Post = require('./post.model');

/**
 * Load post and append to req.
 */
// function load(req, res, next, id) {
//   Post.get(id)
//     .then((post) => {
//       req.post = post; // eslint-disable-line no-param-reassign
//       return next();
//     })
//     .catch(e => next(e));
// }

 function load(req, res, next, id) {

  Post.findById(id)
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

function like(req, res, next) {

  const id = req.params.postId;
  
 
  Post.findByIdAndUpdate(id,  {$push: {like : '5cdb98cdab24ca4b10407752'}}, {
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

  const id = req.params.postId;
  
 
  Post.findByIdAndUpdate(id,  {$push: {respect : '5cdb98cdab24ca4b10407752'}}, {
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

function tag(req, res, next) {

  const id = req.params.postId;
  
 
  Post.findByIdAndUpdate(id,  {$push: {tag : '5cdb98cdab24ca4b10407752'}}, {
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



/**
 * Get post
 * @returns {post}
 */
function get(req, res) {
  return res.json(req.post);
}

/**
 * Create new post
 * @property {string} req.body.postname - The postname of post.
 * @property {string} req.body.mobileNumber - The mobileNumber of post.
 * @returns {post}
 */
function create(req, res, next) {
  
  const post = new Post({
    text: req.body.text,
    location: req.body.location,
    account: req.user
  });

  post.save()
    .then(savePost => res.json(savePost))
    .catch(e => next(e));
}

/**
 * Update existing post
 * @property {string} req.body.postname - The postname of post.
 * @property {string} req.body.mobileNumber - The mobileNumber of post.
 * @returns {post}
 */
function update(req, res, next) {
  const post = req.post;
  post.text = req.body.text;
  post.location = req.body.location;
  

  post.save()
    .then(savedpost => res.json(savedpost))
    .catch(e => next(e));
}

/**
 * Get post list.
 * @property {number} req.query.skip - Number of posts to be skipped.
 * @property {number} req.query.limit - Limit number of posts to be returned.
 * @returns {post[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Post.find()
  .sort({ createdAt: -1 })
  .skip(+skip)
  .limit(+limit)
  .exec(function (err, posts) {
    if (err) {
      return res.status(422).send({
        message: err
      });
    } else {
      res.json(posts);
    }
  });
}

/**
 * Delete post.
 * @returns {post}
 */
function remove(req, res, next) {
  const post = req.post;
  post.remove()
    .then(deletedpost => res.json(deletedpost))
    .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove, like, respect, tag };
