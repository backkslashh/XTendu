# XTendu

Official Bot Invite: https://discord.com/oauth2/authorize?client_id=1256089145286066226&permissions=8&integration_type=0&scope=bot+applications.commands

XTendu is an economy based discord bot. It is currently in beta.
Here are some features it has (or I plan to have in the future):

-   Stock Market
-   Jobs
-   Companies
-   Auctioning Items
-   Loans
-   Bank Accounts
-   Taxes
-   Gambling

## How to set up XTendu for development or personal use

Clone this repo, and add a config.json file with the following:

```
{
	"handlerLogs": true,
	"botToken": "yourDiscordBotTokenHere",
	"mongoURI": "yourMongoURIHere",
	"clientId": "theClientIDOfYourDiscordBot",
	"guildId": "theGuildIDOfYourServer",
	"prefix": "putYourPrefixHereForLegacyCommands",
	"administrators": [
		"putAdminUserIDHere",
		"if you have any other admins, put them here"
	]
}
```

Administrators have access to the following:
Ability to register or unregister other users,
Ability to add any amount of currency to their account.

Make sure you have NodeJS installed on your computer.
In your console, run `npm i` to install all needed dependencies. To start up the bot, run `node .`

# Development Process

When developing, make sure you did all of the steps above.

## Take Note of the Following

-   When updating userSchema model, make sure userClass manifest model matches up\*
-   All classes will return `false` when a document or property does not exist.
-   All commands WILL have to be compatible with slash commands\*, but not all commands have to be compatible with legacy (Running the command with prefix)

\*For the time being

## Commands

Commands in the `/commands` directory will be formatted as following:

```
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	disabled: false, // Command will not run if this is set to true. No need to put this here if it is enabled
	economyBased: false // Command will check if user running has a user document in your database. If not, the command will not run.
	data: new SlashCommandBuilder() // Command Metadata
		.setName("commandname")
		.setDescription("I am the command description!"),
	async execute(interaction, client) { // This will execute for slash commands. Slash command support is required for the time being
		const message = await interaction.deferReply({
			fetchReply: true,
		});

		const APILatency = client.ws.ping;

		let clientPing;
		if (message.createdTimestamp && interaction.createdTimestamp) {
			clientPing =
				message.createdTimestamp - interaction.createdTimestamp;
		} else {
			clientPing = "N/A"; // or handle the error as appropriate
		}

		const newMessage = `API Latency: ${APILatency}\nClient Ping: ${clientPing}`;

		await interaction.editReply({
			content: newMessage,
		});
	},
	legacyExecute(message, args, client) { // This will execute for legacy commands (`>ping`, or whatever prefix followed by `ping`)
		const APILatency = client.ws.ping;
		message.reply({
			content: `APILatency: ${APILatency}\nClient Ping: Client ping is only available for slash commands! Run /ping to see client ping.`,
		});
	},
};

```
