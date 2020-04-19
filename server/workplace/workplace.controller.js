const Workplace = require('./workplace.model');

function remove(req, res, next) {
  
}


const create = (req, res, next) => {
    const workplace = new Workplace({
        company: req.body.companyRef,
        name: req.body.name,
        members: req.body.members,
        account: req.user
    });
  
    workplace
      .save()
      .then(result => res.send(result))
      .catch(e => next(e));
}

const listByCompany = (req, res, ) => {
    const { limit = 5, skip = 0, company = '' } = req.query;
    Workplace.find({ company: company, removed: false })
        .sort({ createdAt: -1 })
        .skip(+skip)
        .limit(+limit)
        .exec()
        .then(result => res.json(result))
        .catch(e => next(e));

}

function edit(req, res) {
  
}

function list(req, res) {
  
}

function read(req, res) {
  
}

function invite(req, res) {
  
}

function kick(req, res) {
  
}


module.exports = { listByCompany, create}