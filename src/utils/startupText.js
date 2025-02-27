module.exports = function (title) {
	const figlet = require("figlet");
	figlet(title, function (err, data) {
		if (err) {
			console.log("Something went wrong...");
			console.dir(err);
			return;
		}
		console.log(data);
	});
};
