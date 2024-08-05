const chalk = require("chalk");
const { prefix, administrators } = require("../../config.json");
const { pleaseRegister } = require("../../utils/filterFunctions");
const User = require("../../utils/userClass");

module.exports = {
	name: "messageCreate",
	once: false,
	on: true,
	async execute(message, client) {
		if (!message.content.startsWith(prefix)) return;
		const { commands } = client;
		const args = message.content.slice(prefix.length).trim().split("/ +/");
		const authorID = message.author.id;
		const commandName = args.shift().toLowerCase();

		const command = commands.get(commandName);
		if (!command) return;
		if (command.economyBased) {
			const user = new User(authorID);
			await pleaseRegister(user, message);
		}

		function checkAdministrator() {
			if (command.administratorOnly) {
				if (!administrators.includes(message.author.id)) {
					message.reply("You are not permitted to run this command!");
					return false;
				}
			}
		}

		try {
			if (typeof command.legacyExecute === "function") {
				if (!checkAdministrator()) return;
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
	},
};
