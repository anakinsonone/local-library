const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const GenreSchema = new Schema({
	name: { type: String, required: true, minLength: 3, maxLength: 100 },
});

GenreSchema.virtual("url").get(function () {
	return `/catalog/genre/${this._id}`;
});

module.exports = model("Genre", GenreSchema);
