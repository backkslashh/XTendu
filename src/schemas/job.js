const { Schema, model } = require("mongoose");

reqNumber = {
	type: Number,
	required: true,
};

reqString = {
	type: String,
	required: true,
};

const jobSchema = new Schema({
	jobIcon: reqString, // An emoji that goes before a job title
	jobTitle: reqString,
	jobID: reqNumber,
	companyAttachmentID: reqNumber, // A job is associated with this company

	unitsPerWorkAction: reqNumber, // After running a work action, you will see the message, "You have {pastTenseAction} {unitsPerWorkAction} {unitMeasurement}!"
	currencyPerUnit: reqNumber, // Amount of currency earned per unit
	XPPerUnit: reqNumber, // Amount of XP earned per unit
	maxActionsPerHour: reqNumber,

	minInteligenceRequirement: reqNumber,
	minStrengthRequirement: reqNumber,

	unitMeasurement: reqString, // After running a work action, you will see the message, "You have {pastTenseAction} {unitsPerWorkAction} {unitMeasurement}!"
	pastTenseAction: reqString, // After running a work action, you will see the message, "You have {pastTenseAction} {unitsPerWorkAction} {unitMeasurement}!"
	presentProgressiveAction: reqString, // When clocking in, you will be greeted with, "To start {presentProgressiveAction} run..."
	infinitiveAction: reqString, // When working, you run the command /work {infiniteAction}
});

module.exports = model("Job", jobSchema);
