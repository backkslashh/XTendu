# XTendu

XTendu is an economy based discord bot. It is currently in beta.
Here are some features it has (or I plan to have in the future):

- Stock Market
- Jobs
- Companies
- Auctioning Items
- Loans
- Bank Accounts
- Taxes
- Gambling

## How to set up XTendu

Clone this repo, and add a config.json file and add the following:
```
{
	"handlerLogs": true,
	"botToken": "yourDiscordBotTokenHere",
	"mongoURI": "yourMongoURIHere",
	"clientId": "theClientIDOfYourDiscordBot",
	"guildId": "theGuildIDOfYourServer",
	"prefix": "putYourPrefixHereForLegacyCommands"
}
```

In your console, run `npm i` to install all needed dependencies. To start up the bot, run `node .`
