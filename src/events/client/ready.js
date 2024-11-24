const chalk = require("chalk");
const startup = require("../../schemas/startup");

module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		const serverCount = client.guilds.cache.size;
		const now = Date.now();

		console.log(
			chalk.green.bold(
				`${client.user.tag} logged in and is active on ${serverCount} server(s)`
			)
		);

		try {
			// Retrieve the last startup time if it exists
			const lastStartupRecord = await startup.findOne().sort({ _id: -1 }); // Sort by most recent

			if (lastStartupRecord) {
				console.log(
					chalk.blue.bold(
						`The bot last started up at: ${new Date(
							lastStartupRecord.lastStartup
						).toLocaleString()}`
					)
				);
			} else {
				console.log(
					chalk.yellow.bold(
						"This is the first time the bot is starting up."
					)
				);
			}

			// Save the current startup time
			await startup.create({ lastStartup: now });
			console.log(
				chalk.green.bold(
					`Current startup time (${now}) saved to database.`
				)
			);
		} catch (error) {
			console.error(
				chalk.red("Failed to handle startup time in database:"),
				error
			);
		}
	},
};
