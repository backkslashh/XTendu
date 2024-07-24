const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Return my ping!"),
	async execute(interaction, client) {
		const message = await interaction.deferReply({
			fetchReply: true,
		});

		const APILatency = client.ws.ping;

		let clientPing;
		if (message.createdTimestamp && interaction.createdTimestamp) {
			clientPing =
				message.createdTimestamp - interaction.createdTimestamp;
		} else {
			clientPing = "N/A"; // or handle the error as appropriate
		}

		const newMessage = `API Latency: ${APILatency}\nClient Ping: ${clientPing}`;

		await interaction.editReply({
			content: newMessage,
		});
	},
	legacyExecute(message, args, client) {
		const APILatency = client.ws.ping;
		message.reply({
			content: `APILatency: ${APILatency}\nClient Ping: Client ping is only available for slash commands! Run /ping to see client ping.`,
		});
	},
};