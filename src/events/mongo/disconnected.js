const chalk = require("chalk");

module.exports = {
	name: "disconnected",
	on: true,
	execute() {
		console.log(chalk.red.bold("[Database Status]: Disconnected"));
	},
};
