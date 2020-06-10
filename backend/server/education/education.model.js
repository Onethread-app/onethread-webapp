// Education Information
const mongoose = require('mongoose');

const {Schema} = mongoose;
const educationSchema = new Schema({
	degree: {
		type: String,
		required: true,
	},
	institutionName: {
		type: String,
		required: true,
	},
	startYear: {
		type: Date,
		required: true,
	},
	endingYear: {
		type: Date,
	},
	currentlyStudy: {
		type: Boolean,
	},
	eduDescription: {
		type: String,
	},
	account: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Account',
		required: true,
	},
});
module.exports = mongoose.model('Education', educationSchema);
