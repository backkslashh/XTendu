const fs = require("fs");

function sanitizeJSFiles(fileList) {
	return fileList.filter((fileName) => fileName.endsWith(".js"));
}

async function pleaseRegister(user, interaction) {
	if (await user.userExists()) {
		return true;
	}
	await interaction.reply({
		content:
			"Woops! It seems you do not have an XTendu profile. Register for one using the `register` command!",
	});
	return false;
}

module.exports = {
	sanitizeJSFiles,
	pleaseRegister,
};
