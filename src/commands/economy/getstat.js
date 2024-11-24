const { SlashCommandBuilder } = require("discord.js");
const User = require("../../utils/userClass");
const userStatsEnum = require("../../utils/userStatsEnum");

// Dynamically mapping stats from userStatsEnum to be used in .addChoices
const statChoices = Object.values(userStatsEnum).map((stat) => ({
	name: stat,
	value: stat,
}));

module.exports = {
	economyBased: true,
	administratorOnly: true,
	data: new SlashCommandBuilder()
		.setName("getstat")
		.setDescription("Gets user economy stat [ADMINSITRATOR ONLY]")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The user whose stat you want to look up.")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("stat")
				.setDescription("The stat you want to look up.")
				.setRequired(true)
				.addChoices(...statChoices)
		),
	async execute(interaction, client) {
		const mentionedUser = interaction.options.getUser("user");
		const stat = interaction.options.getString("stat");
		const user = new User(mentionedUser.id);

		if (!user.userExists())
			return interaction.reply("That user is not registered!");

		const statValue = await user.getStat(stat);

		if (statValue !== undefined) {
			interaction.reply({
				content: `${mentionedUser.username}'s ${stat} is: ${statValue}`,
			});
		} else {
			interaction.reply({
				content: `Stat "${stat}" not found for ${mentionedUser.username}.`,
				ephemeral: true,
			});
		}
	},
};
