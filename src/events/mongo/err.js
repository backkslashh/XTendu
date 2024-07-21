const chalk = require("chalk");

module.exports = {
	name: "error",
	on: true,
	execute(error) {
		console.error(chalk.red.bold(`[Database Status]: ERROR: ${error}`));
	},
};
