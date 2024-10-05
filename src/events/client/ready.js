const chalk = require("chalk");

module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		console.log(chalk.green.bold(`${client.user.tag} logged in`));
		console.log(chalk.green.bold("Enjoy using XTendu! Please report any bugs to the GitHub issues page, thank you!"))
	},
};
