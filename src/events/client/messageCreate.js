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
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const authorID = message.author.id;
		const user = new User(authorID);
		const commandName = args.shift().toLowerCase();
		const command = commands.get(commandName);
		if (!command) return;
		if (command.economyBased) {
			await pleaseRegister(user, message);
		}

		function checkAdministrator() {
			if (command.administratorOnly) {
				if (!administrators.includes(message.author.id)) {
					message.reply("You are not permitted to run this command!");
					return false;
				}
			}
			return true;
		}

		async function checkJobCommand() {
			if (command.jobOnly) {
				if ((await user.getStat("jobID")) == 0)
					message.reply(
						"Woops! It seems like you do not have an XTendu job. This command can only be ran if you have a job. [How to apply for a job](https://google.com)"
					);
				return false;
			}
			return true;
		}

		try {
			if (typeof command.legacyExecute === "function") {
				const isAdmin = checkAdministrator();
				if (!isAdmin) return;
				const hasJob = await checkJobCommand();
				if (!hasJob) return;
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
