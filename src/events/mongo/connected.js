const chalk = require("chalk");

module.exports = {
	name: "connected",
	once: true,
	on: false,
	execute(error) {
		console.log(
			chalk.bold.green(`[Database Status]: CONNECTED TO DATABASE`)
		);
	},
};
