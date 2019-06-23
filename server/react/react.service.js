const mongoose = require('mongoose');

function reactCount(refrence, typeCount) {
  return mongoose
    .model('Post')
    .findByIdAndUpdate(refrence, { $inc: { [typeCount]: 1 } }, { new: true });
}

module.exports = { reactCount };
