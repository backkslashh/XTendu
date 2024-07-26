const { SlashCommandBuilder } = require("discord.js");
const userSchema = require("../../schemas/user");
const mongoose = require("mongoose");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("testregister")
		.setDescription("Register User into Database Test"),
	disabled: true,
	async execute(interaction, client) {
		const authorUserID = interaction.member.id;
		const dbUser = await userSchema.findOne({
			userID: authorUserID,
		});

		if (!dbUser) {
			const newUserEntry = await new userSchema({
				userID: authorUserID,
				currency: 500,
			});

			await newUserEntry.save();

			interaction.reply(
				`Saved your credentials into database:\nuserID ${authorUserID}\nCurrency: 500`
			);
		} else {
			interaction.reply("Yup! its in the db");
		}
	},
};
