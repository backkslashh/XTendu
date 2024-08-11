const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");

module.exports = {
	disabled: true,
	data: new SlashCommandBuilder()
		.setName("button")
		.setDescription("Testing Buttons"),
	async execute(interaction, client) {
		const button = new ButtonBuilder()
			.setCustomId("sub-yt")
			.setLabel("Click Me! NOW")
			.setStyle(ButtonStyle.Primary);

		await interaction.reply({
			components: [new ActionRowBuilder().addComponents(button)],
		});
	},
};
