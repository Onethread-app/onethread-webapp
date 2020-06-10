const mongoose = require('mongoose');

function reactCount(refrence, type, typeCount) {
    // this function can be remove by report count --will remove
    type = String(type).replace(/\b\w/g, (l) => l.toUpperCase());
    return mongoose
        .model(type)
        .findByIdAndUpdate(refrence, {$inc: {[typeCount]: 1}}, {new: true});
}

module.exports = {reactCount};
