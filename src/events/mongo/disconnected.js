const chalk = require("chalk");

module.exports = {
	name: "disconnected",
	on: true,
	execute() {
		console.log(chalk.green.bold("[Database Status]: Connected"));
	},
};
