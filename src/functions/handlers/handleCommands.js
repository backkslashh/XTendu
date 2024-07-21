const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const chalk = require("chalk");
const {
	clientId,
	guildId,
	botToken,
	handlerLogs,
} = require("../../config.json");
const fs = require("fs");

function createCommandStatusTable(commands) {
	const { AsciiTable3, AlignmentEnum } = require("ascii-table3");
	const table = new AsciiTable3("Commands Status")
		.setAlign(2, AlignmentEnum.CENTER)
		.addRowMatrix(commands);

	return table.toString();
}

async function registerCommands(client) {
	const rest = new REST({ version: "9" }).setToken(botToken);

	try {
		console.log(chalk.bold("Refreshing application commands..."));
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: client.commandArray,
		});
		console.log(
			chalk.green.bold("Successfully reloaded application commands")
		);
	} catch (error) {
		console.error(chalk.red.bold("Error in handleCommands.js"), error);
	}
}

function loadCommands(client, commandFolders) {
	let commandStatus = [];
	const { commands, commandArray } = client;

	for (const folder of commandFolders) {
		const commandFiles = fs
			.readdirSync(`./src/commands/${folder}`)
			.filter((file) => file.endsWith(".js"));

		for (const file of commandFiles) {
			const command = require(`../../commands/${folder}/${file}`);
			commands.set(command.data.name, command);
			commandArray.push(command.data.toJSON());
			if (handlerLogs) {
				commandStatus.push([command.data.name, "✅"]);
			}
		}
	}

	console.log(createCommandStatusTable(commandStatus));
}

module.exports = (client) => {
	client.handleCommands = async () => {
		const commandFolders = fs.readdirSync("./src/commands");
		loadCommands(client, commandFolders);
		await registerCommands(client);
	};
};

// TODO: Get rid of this fkin birds nest
// TODO: Add enabling/disabling command logs
