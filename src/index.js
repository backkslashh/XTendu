const config = require("./config.json");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { connect } = require("mongoose");
const { sanitizeJSFiles } = require("./utils/filterFunctions");
const fs = require("fs");
const chalk = require("chalk");

// XTendu Ascii Art
// TODO: Move to utils
const figlet = require("figlet");
figlet("XTendu", function (err, data) {
	if (err) {
		console.log("Something went wrong...");
		console.dir(err);
		return;
	}
	console.log(data);
});

const clientIntents = [
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildMembers,
];
// clientIntents may need to be updated overtime to accomodate for bots new needs

const client = new Client({ intents: clientIntents });
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];
client.legacyCommandArray = [];
// TODO: Add cooldown collection

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
	const functionFiles = sanitizeJSFiles(
		fs.readdirSync(`./src/functions/${folder}`)
	);
	for (const file of functionFiles)
		require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.handleComponents();
client.login(config.botToken);

//Database
(async () => {
	try {
		await connect(config.mongoURI);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
})();
