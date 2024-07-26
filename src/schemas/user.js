const { Schema, model } = require("mongoose");

const userSchema = new Schema({
	userID: { type: Number, index: { unique: true, dropDups: true } },
	currency: Number,
});

module.exports = model("User", userSchema);
