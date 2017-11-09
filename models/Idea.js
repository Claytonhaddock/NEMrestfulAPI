const mongoose = require('mongoose');
const schema   = mongoose.Schema;

const IdeaSchema = new schema({
	title: {
		type: String,
		required: true
	},
	details: {
		type: String,
		required: true
	},
	data: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('ideas', IdeaSchema);