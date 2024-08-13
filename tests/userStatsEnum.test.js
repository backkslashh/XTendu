const userStatsEnum = require("../src/utils/userStatsEnum");
const userClass = require("../src/utils/userClass");
const User = new userClass("1");

describe("isStat", () => {
	it("should return true for all enum values", () => {
		Object.values(userStatsEnum).forEach((stat) => {
			try {
				expect(User.isStat(stat)).toBe(true);
			} catch (error) {
				console.error(`Failed for stat: ${stat}`);
				throw error; // rethrow the error after logging
			}
		});
	});
});
