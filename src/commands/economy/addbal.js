const { SlashCommandBuilder } = require("discord.js");
const User = require("../../utils/userClass");

module.exports = {
	economyBased: true,
	administratorOnly: true,
	data: new SlashCommandBuilder()
		.setName("addbal")
		.setDescription(
			"Adds currency to a user's balance [ADMINISTRATOR ONLY]"
		)
		.addIntegerOption((option) =>
			option
				.setName("amount")
				.setDescription(
					"The amount of currency to add to a users bank account"
				)
				.setRequired(true)
		),
	async execute(interaction, client) {
		const amountToAdd = interaction.options.getInteger("amount");
		const authorUserID = interaction.member.id;
		const user = new User(authorUserID);

		interaction.reply({
			content: `Your new balance is: ${await user.addCurrency(
				amountToAdd
			)}`,
		});
	},
	async legacyExecute(message, args, client) {
		if (!args[0]) return message.reply("Invalid args!");
		const amountToAdd = parseInt(args[0]);
		if (!Number.isInteger(amountToAdd))
			return message.reply("Amount to add must be an integer!");

		const authorUserID = message.author.id;
		const user = new User(authorUserID);

		message.reply({
			content: `Your new balance is ${await user.addCurrency(
				amountToAdd
			)}`,
		});
	},
};
