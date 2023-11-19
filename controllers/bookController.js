const Book = require("../models/book");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Site Home Page");
});

//Display list of all books
exports.book_list = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Book list");
});

//Display detail page for a specific book
exports.book_detail = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Book detail");
});

//Display Book create form on GET
exports.book_create_get = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Book create GET");
});

//Handle Book create on POST
exports.book_create_post = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Book create POST");
});

//Display Book delete form on GET
exports.book_delete_get = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Book delete GET");
});

//Handle Book delete on POST
exports.book_delete_post = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Book delete POST");
});

//Display Book update form on GET
exports.book_update_get = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Book update GET");
});

//Handle Book update on POST
exports.book_update_post = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Book update POST");
});
