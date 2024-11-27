const { SlashCommandBuilder } = require("discord.js");
const User = require("../../utils/userClass");

module.exports = {
	economyBased: true,
	jobOnly: true,
	data: new SlashCommandBuilder()
		.setName("clockout")
		.setDescription("Clock out of your job!"),
	async execute(interaction, client) {
		const authorUserID = interaction.member.id;
		const user = new User(authorUserID);

		const isClockedIn = await user.getStat("isClockedIn");
		if (!isClockedIn) {
			interaction.reply(
				"You are already clocked out! To clock in, run /clockin"
			);
			return;
		}
		await user.clockOut();
		interaction.reply("You are now clocked out!");
	},
	async legacyExecute(message, args, client) {
		const authorUserID = message.author.id;
		const user = new User(authorUserID);

		const isClockedIn = await user.getStat("isClockedIn");
		if (!isClockedIn) {
			message.reply(
				"You are already clocked out! To clock in, run /clockin"
			);
			return;
		}
		await user.clockOut();
		message.reply("You are now clocked out!");
	},
};
