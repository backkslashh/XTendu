const { Schema, model } = require("mongoose");

reqNumber = {
	type: Number,
	required: true,
};

const inventoryItemSchema = new Schema({
	id: { type: Number, required: true },
	amount: { type: Number, required: true },
});

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
	totalIncomeThisWeek: Number,
	expensesThisWeek: Number,
});

module.exports = model("User", userSchema);
