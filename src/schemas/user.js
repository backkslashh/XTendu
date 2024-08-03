const { Schema, model } = require("mongoose");

reqNumber = {
	type: Number,
	required: true,
};

const userSchema = new Schema({
	userID: {
		type: Number,
		index: { unique: true, dropDups: true },
		required: true,
	},
	currency: reqNumber,
	jobID: reqNumber,
	intelligence: reqNumber,
	strength: reqNumber,
	level: reqNumber,
	xp: reqNumber,
	inventory: {
		food: [{ type: Number }],
		art: [{ type: Number }],
		permits: [{ type: Number }],
	},
	stock: [
		{
			companyID: Number,
			amountOfStocks: Number,
		},
	],
	totalIncomeThisWeek: Number,
	expensesThisWeek: Number,
});

module.exports = model("User", userSchema);
