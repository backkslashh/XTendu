const { bold } = require("chalk");
const { InteractionType } = require("discord.js");
const { pleaseRegister } = require("../../utils/filterFunctions");
const User = require("../../utils/userClass");
const { administrators } = require("../../config.json");

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

		const user = new User(interaction.user.id);

		if (!command) return;
		if (command.economyBased) {
			const documentExists = await pleaseRegister(user, interaction);
			if (!documentExists) return;
		}
		if (command.administratorOnly) {
			if (!administrators.includes(interaction.user.id)) {
				interaction.reply("You are not permitted to run this command!");
				return;
			}
		}
		if (command.jobOnly) {
			const hasJob = (await user.getStat("jobID")) != 0;
			if (!hasJob) {
				interaction.reply(
					"Woops! It seems like you don't have an XTendu job! [How to apply for a job](https://google.com)"
				);
				return;
			}
		}
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
