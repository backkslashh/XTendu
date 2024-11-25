const { Schema, model } = require("mongoose");

reqNumber = {
	type: Number,
	required: true,
};

const inventoryItemSchema = {
	id: { type: Number, required: true },
	amount: { type: Number, required: true },
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
		food: [inventoryItemSchema],
		art: [inventoryItemSchema],
		permits: [{ type: Number }],
	},
	stock: [
		{
			companyID: Number,
			amountOfStocks: Number,
		},
	],
	totalIncomeThisWeek: reqNumber,
	expensesThisWeek: reqNumber,
});

module.exports = model("User", userSchema);
