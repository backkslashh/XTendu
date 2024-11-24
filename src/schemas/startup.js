const { Schema, model } = require("mongoose");

const startupSchema = new Schema({
	lastStartup: {
		type: Number, // Unix Timestamp
		required: true,
	},
});

module.exports = model("Startup", startupSchema);
