const { SlashCommandBuilder } = require("discord.js");
const User = require("../../utils/userClass");

module.exports = {
	economyBased: true,
	jobOnly: true,
	data: new SlashCommandBuilder()
		.setName("clockin")
		.setDescription("Clock in to your job!"),
	async execute(interaction, client) {
		const authorUserID = interaction.member.id;
		const user = new User(authorUserID);

		const isClockedIn = await user.getStat("isClockedIn");
		if (isClockedIn) {
			interaction.reply(
				"You are already clocked in! To clock out, run /clockout"
			);
			return;
		}
		await user.clockIn();
		interaction.reply(
			"You are now clocked in! Run /work to start working!"
		);
	},
	async legacyExecute(message, args, client) {
		const authorUserID = message.author.id;
		const user = new User(authorUserID);

		const isClockedIn = await user.getStat("isClockedIn");
		if (isClockedIn) {
			message.reply(
				"You are already clocked in! To clock out, run /clockout"
			);
			return;
		}
		await user.clockIn();
		message.reply("You are now clocked in!");
	},
};
