const { Schema, model } = require("mongoose");

const userSchema = new Schema({
	userID: Number,
	currency: Number,
});

module.exports = model("User", userSchema);
