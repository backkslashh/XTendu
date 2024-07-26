const userSchema = require("../schemas/user");

module.exports = class User {
	constructor(userId) {
		this.userId = userId;
	}

	async manifest() {
		if (await this.userExists()) {
			return false;
		}
		const userDocumentModel = new userSchema({
			userID: this.userId,
			currency: 500,
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
		return await userSchema.findOne({ userID: this.userId });
	}

	async getCurrency() {
		const user = await this.getUserDocument();
		return user ? user.currency : null;
	}

	async setCurrency(amount) {
		await userSchema.updateOne(
			{ userId: this.userId },
			{ $set: { currency: amount } },
			{ upsert: true }
		);
	}

	async addCurrency(amount) {
		const user = await this.getUserDocument();
		const currentCurrency = user ? user.currency : 0;
		await this.setCurrency(currentCurrency + amount);
	}

	async subtractCurrency(amount) {
		await this.addCurrency(-1 * amount);
	}
};
