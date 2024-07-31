const { SlashCommandBuilder } = require("discord.js");
const User = require("../../utils/userClass");
const { pleaseRegister } = require("../../utils/filterFunctions");

module.exports = {
	economyBased: true,
	data: new SlashCommandBuilder()
		.setName("balance")
		.setDescription("Returns user's balance"),
	async execute(interaction, client) {
		const authorUserID = interaction.member.id;
		const user = new User(authorUserID);

		interaction.reply({
			content: `Your balance is: ${await user.getCurrency()}`,
		});
	},
	async legacyExecute(message, args, client) {
		const authorUserID = message.author.id;
		const user = new User(authorUserID);

		if (!(await pleaseRegister(user, message))) return;

		message.reply({
			content: `Your balance is: ${await user.getCurrency()}`,
		});
	},
};
