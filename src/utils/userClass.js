const userSchema = require("../schemas/user");
const { percentTaxed } = require("../config.json");
const { TOTAL_INCOME_THIS_WEEK } = require("../utils/userStatsEnum");

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
		await userDocumentModel.save();
		return true;
	}

	/**
	 *
	 * @param {String} stat
	 * @returns {Boolean}
	 */
	isNumericalStat(stat) {
		const validStats = Object.keys(userSchema.schema.paths).filter(
			(field) => {
				return userSchema.schema.paths[field].instance === "Number";
			}
		);
		return validStats.includes(stat);
	}

	isStat(stat) {
		const allFields = Object.keys(userSchema.schema.paths);

		// Create a set of top-level fields
		const topLevelFields = new Set(
			allFields.map((field) => field.split(".")[0])
		);
		// Check if the given stat is a top-level field
		return topLevelFields.has(stat);
	}

	/**
	 *
	 * @param {String} statName
	 * @param {Number} newValue
	 */
	async updateNumericalStat(statName, newValue) {
		if (!this.isNumericalStat(statName)) {
			throw new Error("Attempted to update stat that does not exist.");
		}
		const userDocument = await this.getUserDocument();
		userDocument[statName] = newValue;
		await userDocument.save();
	}

	/**
	 *
	 * @param {String} statName
	 * @returns {any}
	 */
	async getNumericalStat(statName) {
		if (!this.isNumericalStat(statName)) {
			throw new Error("Stat is non-numerical");
		}
		const userDocument = await this.getUserDocument();
		return userDocument[statName];
	}

	/**
	 * @deprecated Use getNumbericalStat() instead.
	 * @param {String} statName
	 * @returns
	 */

	async getStat(statName) {
		if (!this.isStat(statName)) {
			throw new Error("Stat is non-numerical");
		}
		const userDocument = await this.getUserDocument();
		return userDocument[statName];
	}

	/**
	 *
	 * @returns {Boolean}
	 */
	async userExists() {
		const user = await this.getUserDocument();
		return user !== null;
	}

	async getUserDocument() {
		return await userSchema.findOne({ userID: this.userID });
	}

	/**
	 * @deprecated When setting curency, use updateNumeratedStat("currency", number). Will be removed after official release of XTendu.
	 */
	async setCurrency(amount) {
		console.warn(
			`WARNING: the 'setCurrency' function is now deprecated. Please use updateNumericalStat("currency", amount)`
		);
		await userSchema.updateOne(
			{ userID: this.userID },
			{ $set: { currency: amount } },
			{ upsert: true }
		);
	}

	/**
	 * Adds currency to user's bank account
	 * @param {Number} amount
	 * @returns {Number}
	 */
	async addCurrency(amount) {
		const user = await this.getUserDocument();

		const currentCurrency = user ? user.currency : 0;
		const newCurrency = currentCurrency + amount;

		await this.updateNumericalStat("currency", newCurrency);

		const incomeThisWeek = await this.getNumericalStat(
			TOTAL_INCOME_THIS_WEEK
		);
		await this.updateNumericalStat(
			TOTAL_INCOME_THIS_WEEK,
			incomeThisWeek + amount
		);

		return newCurrency;
	}

	/**
	 * Subtracts currency from user's bank account
	 * @param {Number} amount
	 * @returns {Number}
	 */
	async subtractCurrency(amount) {
		return await this.addCurrency(-1 * amount);
	}

	async getJobInformation() {
		// TODO
	}

	async getTaxOwed() {
		const income = await this.getNumericalStat(TOTAL_INCOME_THIS_WEEK);
		return income * percentTaxed * 0.01; // 0.01 to convert percent to decimal
	}

	async taxUser() {
		const amountOwed = await this.getTaxOwed(TOTAL_INCOME_THIS_WEEK);
		await this.updateNumericalStat(TOTAL_INCOME_THIS_WEEK, 0);
		return await this.subtractCurrency(amountOwed);
	}
};
