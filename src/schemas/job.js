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
	jobID: reqNumber,
	jobIcon: reqString, // An emoji that goes before a job title
	jobTitle: reqString,
	jobDescription: reqString,
	companyAttachmentID: reqNumber, // A job is associated with this company

	unitsPerWorkAction: reqNumber, // After running a work action, you will see the message, "You have {pastTenseAction} {unitsPerWorkAction} {unitMeasurement}!"
	currencyPerUnit: reqNumber, // Amount of currency earned per unit
	XPPerUnit: reqNumber, // Amount of XP earned per unit
	maxActionsPerHour: reqNumber,
	actionsPerLevelUp: reqNumber, // Amount of work actions to level up from 1 to 2
	exponentialLevelUp: reqNumber, // Controls how much harder leveling up becomes for higher levels

	minInteligenceRequirement: reqNumber,
	minStrengthRequirement: reqNumber,

	unitMeasurement: reqString, // After running a work action, you will see the message, "You have {pastTenseAction} {unitsPerWorkAction} {unitMeasurement}!"
	pastTenseAction: reqString, // After running a work action, you will see the message, "You have {pastTenseAction} {unitsPerWorkAction} {unitMeasurement}!"
	presentProgressiveAction: reqString, // When clocking in, you will be greeted with, "To start {presentProgressiveAction} run..."
	infinitiveAction: reqString, // When working, you run the command /work {infiniteAction}
});

module.exports = model("Job", jobSchema);
