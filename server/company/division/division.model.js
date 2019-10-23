const mongoose = require('mongoose');

const divisionSchema = mongoose.Schema({
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

module.exports = mongoose.model('Division', divisionSchema);
