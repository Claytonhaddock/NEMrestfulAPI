const mongoose = require('mongoose');
const schema   = mongoose.Schema;

const UserSchema = new schema({
	name: {
		type: String,
		required: true
	},
	details: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
	date: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('users', UserSchema);