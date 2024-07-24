const chalk = require("chalk");
const { prefix } = require("../../config.json");

module.exports = {
	name: "messageCreate",
	once: false,
	on: true,
	async execute(message, client) {
		if (message.content.startsWith(prefix)) {
			const { commands } = client;
			const args = message.content
				.slice(prefix.length)
				.trim()
				.split("/ +/");
			const commandName = args.shift().toLowerCase();

			const command = commands.get(commandName);
			if (!command) return;

			try {
				if (typeof command.legacyExecute === "function") {
					command.legacyExecute(message, args, client);
				} else {
					message.reply(
						`This command only exists for slash commands! Run /${commandName} instead!`
					);
				}
			} catch (error) {
				message.reply(
					"Sorry! Something went wrong while executing this command 😔"
				);
			}
		}
	},
};
