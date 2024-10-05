const { readdirSync } = require("fs");
const { sanitizeJSFiles } = require("../../utils/filterFunctions");
const { italic, bold } = require("chalk");
const printIfEnabled = require("../../utils/handlerLog")

module.exports = (client) => {
	client.handleComponents = async () => {
		const componentFolders = readdirSync("./src/components");
		for (const folder of componentFolders) {
			const componentFiles = sanitizeJSFiles(
				readdirSync(`./src/components/${folder}`)
			);

			const { buttons, selectMenus, modals } = client;

			switch (folder) {
				case "buttons":
					printIfEnabled(italic("Assigning Buttons..."));
					for (const file of componentFiles) {
						const button = require(`../../components/${folder}/${file}`);
						buttons.set(button.data.name, button);
					}
					break;
				case "selectMenus":
					printIfEnabled(italic("Assigning Select Menus..."));
					for (const file of componentFiles) {
						const menu = require(`../../components/${folder}/${file}`);
						selectMenus.set(menu.data.name, menu);
					}
					break;

				case "modals":
					for (const file of componentFiles) {
						const modal = require(`../../components/${folder}/${file}`);
						modals.set(modal.data.name, modal);
					}
					break;
				default:
					break;
			}
		}
		printIfEnabled(italic.green("Components Handled"));
	};
};
