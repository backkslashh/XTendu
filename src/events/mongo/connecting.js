const chalk = require("chalk");

module.exports = {
	name: "connecting",
	once: true,
	execute(error) {
		console.error(
			chalk.italic.white(`[Database Status]: Connecting to database...`)
		);
	},
};
