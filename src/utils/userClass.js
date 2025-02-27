const userSchema = require("../schemas/user");
const { percentTaxed } = require("../config.json");
const {
	TOTAL_INCOME_THIS_WEEK,
	IS_CLOCKED_IN,
	LAST_DAILY_CLAIMED,
	DAILY_STREAK,
} = require("../utils/userStatsEnum");

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
			jobLevel: 1,
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
			totalIncomeThisWeek: 0,
			expensesThisWeek: 0,
			isClockedIn: false,
			lastDailyClaimed: 0,
			dailyStreak: 0,
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
	 * @returns {any}
	 */
	async getNumericalStat(statName) {
		if (!this.isNumericalStat(statName)) {
			throw new Error("Stat is non-numerical");
		}
		const userDocument = await this.getUserDocument();
		return userDocument[statName];
	}

	async updateStat(statName, newValue) {
		if (!this.isStat(statName)) {
			throw new Error("Stat does not exist");
		}
		const userDocument = await this.getUserDocument();
		userDocument[statName] = newValue;
		await userDocument.save();
	}

	async getStat(statName) {
		if (!this.isStat(statName)) {
			throw new Error("Stat does not exist");
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

		await this.updateStat("currency", newCurrency);

		const incomeThisWeek = await this.getNumericalStat(
			TOTAL_INCOME_THIS_WEEK
		);
		await this.updateStat(TOTAL_INCOME_THIS_WEEK, incomeThisWeek + amount);

		return newCurrency;
		// TODO: Reset TOTAL_INCOME_THIS_WEEK every week
		// JEREMY: What the fuck is this??? Backslash are you high while coding or should we just fucking fire you at this point
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
		await this.updateStat(TOTAL_INCOME_THIS_WEEK, 0);
		return await this.subtractCurrency(amountOwed);
	}

	async clockIn() {
		await this.updateStat(IS_CLOCKED_IN, true);
	}

	async clockOut() {
		await this.updateStat(IS_CLOCKED_IN, false);
	}

	async canClaimDaily() {
		const lastDailyClaimed = this.getStat(LAST_DAILY_CLAIMED);
		const now = Date.now();
		const oneDay = 86400 * 1000;
		if (now - lastDailyClaimed > oneDay) return true;
		return false;
	}

	async calculateDailyGold() {
		const dailyStreak = await this.getStat(DAILY_STREAK);
		const dailyStreakCapped = Math.min(dailyStreak, 50);
		return dailyStreakCapped ** 2 + 20 * dailyStreakCapped + 200; // f(x) = x^2 + x + 200
	}

	async claimDailyGold() {
		const canClaimDaily = await this.canClaimDaily();
		if (!canClaimDaily) return;

		const goldToGive = this.calculateDailyGold();
		this.addCurrency(await goldToGive);
		this.updateStat(LAST_DAILY_CLAIMED, Date.now());
	}
};
