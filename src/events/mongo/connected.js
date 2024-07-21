const chalk = require("chalk");

module.exports = {
	name: "connected",
	once: true,
	on: false,
	execute(error) {
		console.error(
			chalk.bold.green(`[Database Status]: CONNECTED TO DATABASE`)
		);
	},
};
