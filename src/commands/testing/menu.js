const {
	SlashCommandBuilder,
	StringSelectMenuBuilder,
	ActionRowBuilder,
	StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("menu")
		.setDescription("Test Selection Menu"),
	async execute(interaction, client) {
		const menu = new StringSelectMenuBuilder()
			.setCustomId("sub-menu")
			.setMinValues(1)
			.setMaxValues(1)
			.setOptions(
				new StringSelectMenuOptionBuilder({
					label: "Option #1",
					value: "https://www.youtube.com/@backkslashh",
				}),
				new StringSelectMenuOptionBuilder({
					label: "Option #2",
					value: "https://youtube.com/@JinxCloudDrop",
				})
			);

		await interaction.reply({
			components: [new ActionRowBuilder().addComponents(menu)],
		});
	},
};
