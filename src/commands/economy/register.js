// Creates a new user document in the database

const { SlashCommandBuilder } = require("discord.js");
const userSchema = require("../../schemas/user");
const mongoose = require("mongoose");
const User = require("../../utils/userClass");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("register")
		.setDescription("Register an XTendu account to start using XTendu!"),
	async execute(interaction, client) {
		const user = new User(interaction.user.id);
		const status = await user.manifest();
		if (status) {
			interaction.reply(
				"Successfully registered your profile! Feel free to start using economy based commands!"
			);
		} else {
			interaction.reply(
				"Hmmm... It seems like you have already registered!"
			);
		}
	},
};
