const mongoose = require('mongoose');
const { Schema } = mongoose;
const departmentSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    require: true,
  },
});
module.exports = mongoose.model('Department', departmentSchema);
