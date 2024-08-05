const { SlashCommandBuilder } = require("discord.js");
const User = require("../../utils/userClass");

module.exports = {
	economyBased: true,
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
};
