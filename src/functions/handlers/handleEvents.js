const fs = require("fs");
const { sanitizeJSFiles } = require("../.././utils/filterFunctions");
const { italic } = require("chalk");
const { connection } = require("mongoose");
const chalk = require("chalk");
const printIfEnabled = require("../../utils/handlerLog")

function handleEvent(event, client) {
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

function handleClientEvents(client, folder, eventFiles) {
	eventFiles.forEach((file) => {
		const event = require(`../../events/${folder}/${file}`);
		handleEvent(event, client);
	});

}

function loadAndAssignEvents(folder, client) {
	const eventFiles = sanitizeJSFiles(
		fs.readdirSync(`./src/events/${folder}`)
	);
	if (folder == "client") {
		handleClientEvents(client, folder, eventFiles)
	} else if (folder == "mongo") {
		for (const file of eventFiles) {
			const event = require(`../../events/${folder}/${file}`);
			if (event.once) {
				connection.once(event.name, (...args) =>
					event.execute(...args, client)
				);
			} else if (event.on) {
				connection.on(event.name, (...args) =>
					event.execute(...args, client)
				);
			}
		}
	}
}

module.exports = (client) => {
	client.handleEvents = async () => {
		const eventFolders = fs.readdirSync("./src/events");
		eventFolders.forEach((folder) => loadAndAssignEvents(folder, client));
		printIfEnabled(italic.green("Events Handled"));
	};
};
