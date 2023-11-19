const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");

//Display list of all Genres
exports.genre_list = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Genre list");
});

//Display details of a specific Genre
exports.genre_detail = asyncHandler(async (req, res, next) => {
	const { params } = req;
	const { id } = params;
	res.send(`NOT IMPLEMENTED: Genre detail: ${id}`);
});

//Display Genre create form on GET
exports.genre_create_get = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Genre create GET");
});

//Handle Genre create on POST
exports.genre_create_post = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Genre create POST");
});

//Display Genre delete form on GET
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Genre create GET");
});

//Handle Genre delete on POST
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Genre delete POST");
});

//Display Genre update form on GET
exports.genre_update_get = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Genre update GET");
});

//Handle Genre update on POST
exports.genre_update_post = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Genre update POST");
});
