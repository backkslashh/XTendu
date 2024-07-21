const chalk = require("chalk");

module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		console.log(chalk.green.bold(`${client.user.tag} logged in`));
	},
};
