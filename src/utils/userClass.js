const userSchema = require("../schemas/user");
const { percentTaxed } = require("../config.json");

module.exports = class User {
	constructor(userID) {
		this.userID = userID;
	}

	async manifest() {
		if (await this.userExists()) {
			return false;
		}
		const userDocumentModel = new userSchema({
			userID: this.userID,
			currency: 500,
			jobID: 0, // A job ID of 0 represents no job
			strength: 10,
			intelligence: 10,
			level: 1,
			xp: 0,
			inventory: {
				food: [],
				art: [],
				permits: [],
			},
			stock: [],
			totalIncomeThisWeek: 500,
			expensesThisWeek: 0,
		});
		userDocumentModel.save();
		return true;
	}

	async userExists() {
		try {
			const user = await this.getUserDocument();
			return user !== null;
		} catch (error) {
			console.error(`Error checking if user exists: ${error}`);
			throw new Error("Failed to check if user exists");
		}
	}

	async getUserDocument() {
		return await userSchema.findOne({ userID: this.userID });
	}

	async getCurrency() {
		const user = await this.getUserDocument();
		return user ? user.currency : false;
	}

	async setCurrency(amount) {
		await userSchema.updateOne(
			{ userID: this.userID },
			{ $set: { currency: amount } },
			{ upsert: true }
		);
	}

	async addCurrency(amount) {
		const user = await this.getUserDocument();
		const currentCurrency = user ? user.currency : 0;
		await this.setCurrency(currentCurrency + amount);
		return amount;
	}

	async subtractCurrency(amount) {
		await this.addCurrency(-1 * amount);
		return amount;
	}

	async getJobInformation() {
		// TODO
	}

	async getStrength() {
		const user = await this.getUserDocument();
		return user ? user.strength : false;
	}

	async getIntelligence() {
		const user = await this.getUserDocument();
		return user ? user.intelligence : false;
	}

	async getLevel() {
		const user = await this.getUserDocument();
		return user ? user.level : false;
	}

	async getXP() {
		const user = await this.getUserDocument();
		return user ? user.xp : false;
	}

	async getInventory() {
		const user = await this.getUserDocument();
		return user ? user.invetory : false;
	}

	async getUserStocks() {
		const user = await this.getUserDocument();
		return user ? user.stocks : false;
	}

	async getIncomeThisWeek() {
		const user = await this.getUserDocument();
		return user ? user.totalIncomeThisWeek : false;
	}

	async getTaxOwed() {
		const income = this.getIncomeThisWeek();
		return income * percentTaxed * 0.01; // 0.01 to convert percent to decimal
	}

	async taxUser() {
		const amountOwed = this.getTaxOwed();
		return this.subtractCurrency(amountOwed);
	}
};
