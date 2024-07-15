const Genre = require('../models/genre');
const Book = require('../models/book');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

// Display list of all Genres
exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().sort({name: 1}).exec();

  res.render('genre_list', {
    title: 'Genre List',
    genre_list: allGenres,
  });
});

// Display details of a specific Genre
exports.genre_detail = asyncHandler(async (req, res, next) => {
  const {params} = req;
  const {id} = params;

  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(id).exec(),
    Book.find({genre: id}, 'title summary').exec(),
  ]);

  if (genre === null) {
    const err = new Error('Genre not found.');
    err.status = 400;
    return next(err);
  }

  res.render('genre_detail', {
    title: 'Genre Detail',
    genre: genre,
    books_in_genre: booksInGenre,
  });
});

// Display Genre create form on GET
exports.genre_create_get = asyncHandler(async (req, res, next) => {
  res.render('genre_form', {title: 'Create Genre'});
});

// Handle Genre create on POST
exports.genre_create_post = [
  // Validate and sanitize the name field.
  body('name', 'Genre name must contain at least 3 characters')
    .trim()
    .isLength({min: 3})
    .escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    const {name} = req.body;
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({name});

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('genre_form', {
        title: 'Create Genre',
        genre: genre,
        erorrs: errors.array(),
      });
      return;
    } else {
      // Date from form is valid.
      // Check if Genre with same name already exists.
      const genreExists = await Genre.findOne({name})
        .collation({locale: 'en', strength: 2})
        .exec();

      if (genreExists) {
        // Genre exists, redirect to its detail page
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(genre.url);
      }
    }
  }),
];

// Display Genre delete form on GET
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre create GET');
});

// Handle Genre delete on POST
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre delete POST');
});

// Display Genre update form on GET
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre update GET');
});

// Handle Genre update on POST
exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre update POST');
});
