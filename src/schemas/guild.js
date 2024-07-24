const { Schema, model } = require("mongoose");

const reqString = {
	type: String,
	required: true,
};

const guildSchema = new Schema({
	guildID: reqString,
	guildName: reqString,
	guildIcon: reqString,
});

module.exports = model("Guild", guildSchema);
