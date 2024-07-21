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
		const clientPing =
			message.createdTimestamp - interaction.createdTimestamp;

		const newMessage = `API Latency: ${APILatency}\nClient Ping: ${clientPing}`;

		await interaction.editReply({
			content: newMessage,
		});
	},
};
