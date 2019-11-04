const Board = require("./board.model");

const load = (req, res, next, id) => {
  Board.findById(id)
    .exec()
    .then(result => {
      if (result) {
        req.board = result;
        return next();
      }
      return res.status(400).json({ message: "No valid entry found for provided Board ID" })
    }).catch(err => {
      next(err);
    });
}

const get = (req, res) => {
  return res.json(req.board);
}

const create = async (req, res, next) => {

  try {
    const board = new Board({
      name: req.body.name,
      description: req.body.description,
      account: req.user._id,
      company: req.body.companyId
    });
    board.save().then(createdBoard => res.status(201).json(createdBoard))
      .catch(e => next(e));
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}

const update = (req, res, next) => {

}

const addBoardMembers = (req, res, next) => {

}

const addBoardColumn = (req, res, next) => {

}

const list = (req, res, next) => {
  const { limit = 50, skip = 0, companyId } = req.query;
  Board.find({
    $or: [
      { account: req.user }, 
      { members:  { $elemMatch: { _id: req.user } }}
    ],
    company: companyId,
    removed: false 
  }).select("_id name description")
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec().then(result => {
      res.json(result);
    })
    .catch(e => next(e));
}

const remove = (req, res, next) => {
  const board = req.board;
  // remove task 
  // remove column
  // remove board
}

module.exports = { load, get, create, list, remove, update, addBoardMembers, addBoardColumn };