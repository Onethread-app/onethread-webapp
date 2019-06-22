const mongoose = require('mongoose');

function reactCount(refrence, type, typeCount) {
  type = String(type).replace(/\b\w/g, l => l.toUpperCase());

  return mongoose
    .model(type)
    .findByIdAndUpdate(refrence, { $inc: { [typeCount]: 1 } }, { new: true });
}

module.exports = { reactCount };
