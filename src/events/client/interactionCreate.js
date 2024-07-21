const { bold } = require("chalk");
const { InteractionType } = require("discord.js");

module.exports = {
	name: "interactionCreate",
	async execute(interaction, client) {
		// TODO: Move all cases to own function and use switch cases
		if (interaction.isContextMenuCommand()) {
			const { commands } = client;
			const { commandName } = interaction;
			const contextCommand = commands.get(commandName);

			if (!contextCommand) return;

			try {
				await contextCommand.execute(interaction, client);
			} catch (error) {
				console.error(error);
			}
		}
		if (interaction.type == InteractionType.ModalSubmit) {
			const { modals } = client;
			const { customId } = interaction;
			const modal = modals.get(customId);

			if (!modal) {
				return new Error(
					bold.red("Command has called modal that does not exist")
				);
			}

			try {
				await modal.execute(interaction, client);
			} catch (error) {
				console.error(bold.red(error));
			}
		}
		if (interaction.isStringSelectMenu()) {
			const { selectMenus } = client;
			const { customId } = interaction;
			const menu = selectMenus.get(customId);
			if (!menu) {
				return new Error(
					bold.red(
						"Command has called selectMenuId that does not exist"
					)
				);
			}

			try {
				await menu.execute(interaction, client);
			} catch (error) {
				console.error(error);
			}
		}
		if (interaction.isButton()) {
			const { buttons } = client;
			const { customId } = interaction;
			const button = buttons.get(customId);
			if (!button) {
				return new Error(
					bold.red("Command has called buttonId that does not exist")
				);
			}

			try {
				await button.execute(interaction, client);
			} catch (err) {
				console.error(bold.red(err));
			}
		}
		if (!interaction.isChatInputCommand()) return;
		const { commands } = client;
		const { commandName } = interaction;
		const command = commands.get(commandName);

		if (!command) return;
		try {
			await command.execute(interaction, client);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: "Something went wrong on the server side. Woops!...",
				ephemeral: true,
			});
		}
	},
};
