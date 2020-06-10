const Save = require('./save.model');

const load = (req, res, next, id) => {
    Save.findById(id)
        .exec()
        .then((result) => {
            if (result) {
                req.save = result;
                return next();
            }
            return res
                .status(400)
                .json({message: 'No valid entry found for provided ID'});
        })
        .catch((err) => {
            // console.log(err);
            next(err);
        });
};

const get = (req, res) => {
    return res.json(req.save);
};

const create = (req, res, next) => {
    const save = new Save({
        postRef: req.body.postRef,
        account: req.user,
    });

    save.save()
        .then((result) => res.send(result))
        .catch((e) => next(e));
};

const list = (req, res, next) => {
    const {limit = 50, skip = 0} = req.query;
    Save.find({removed: false})
        .sort({createdAt: -1})
        .skip(+skip)
        .limit(+limit)
        .exec()
        .then((result) => res.json(result))
        .catch((e) => next(e));
};

const remove = (req, res, next) => {
    const {save} = req;
    save.removed = true;

    save.remove()
        .then((result) => res.json(result))
        .catch((e) => next(e));
};

module.exports = {load, create, get, remove, list};
