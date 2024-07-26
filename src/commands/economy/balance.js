const { SlashCommandBuilder } = require("discord.js");
const userSchema = require("../../schemas/user");
const mongoose = require("mongoose");
const User = require("../../utils/userClass");
const { legacyExecute } = require("../testing/ping");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("balance")
		.setDescription("Returns user's balance"),
	async execute(interaction, client) {
		const authorUserID = interaction.member.id;
		const user = new User(authorUserID);

		if (await user.userExists()) {
			interaction.reply(`Your balance is: ${await user.getCurrency()}`);
		} else {
			interaction.reply(
				"Woops! It seems you do not have an XTendu profile. Register for one using the `register` command!"
			);
		}
	},
	async legacyExecute(message, args, client) {
		const authorUserID = message.author.id;
		const user = new User(authorUserID);

		if (await user.userExists()) {
			message.reply(`Your balance is: ${await user.getCurrency()}`);
		} else {
			message.reply(
				"Woops! It seems you do not have an XTendu profile. Register for one using the `register` command!"
			);
		}
	},
};
