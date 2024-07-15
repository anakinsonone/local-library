const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');
const {body, validationResult} = require('express-validator');

const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
  const [
    numBooks,
    numBookInstances,
    numAvailableBookInstances,
    numAuthors,
    numGenres,
  ] = await Promise.all([
    Book.countDocuments({}).exec(),
    BookInstance.countDocuments({}).exec(),
    BookInstance.countDocuments({status: 'Available'}).exec(),
    Author.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  res.render('index', {
    title: 'Local Library Home',
    book_count: numBooks,
    book_instance_count: numBookInstances,
    book_instance_available_count: numAvailableBookInstances,
    author_count: numAuthors,
    genre_count: numGenres,
  });
});

// Display list of all books
exports.book_list = asyncHandler(async (req, res, next) => {
  const allBooks = await Book.find({}, 'title author')
    .sort({title: 1})
    .populate('author')
    .exec();

  res.render('book_list', {title: 'Book List', book_list: allBooks});
});

// Display detail page for a specific book
exports.book_detail = asyncHandler(async (req, res, next) => {
  const {params} = req;
  const {id} = params;

  const [book, bookInstances] = await Promise.all([
    Book.findById(id).populate('author').populate('genre').exec(),
    BookInstance.find({book: id}).exec(),
  ]);

  if (book === null) {
    const err = new Error('Book not found.');
    err.status = 400;

    return next(err);
  }

  res.render('book_detail', {
    title: book.title,
    book,
    book_instances: bookInstances,
  });
});

// Display Book create form on GET
exports.book_create_get = asyncHandler(async (req, res, next) => {
  // Get all authors and genres, which we can use for adding to our book.
  const [allAuthors, allGenres] = await Promise.all([
    Author.find().sort({family_name: 1}).exec(),
    Genre.find().sort({name: 1}).exec(),
  ]);

  res.render('book_form', {
    title: 'Create Book',
    authors: allAuthors,
    genres: allGenres,
  });
});

// Handle Book create on POST
exports.book_create_post = [
  // Convert the genre to an array
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === 'undefined' ? [] : [req.body.genre];
    }
    next();
  },

  // Validate and sanitize fields
  body('title', 'Title must not be empty.').trim().isLength({min: 1}).escape(),
  body('author', 'Author must not be empty.')
    .trim()
    .isLength({min: 1})
    .escape(),
  body('summary', 'Summary must not be empty.')
    .trim()
    .isLength({min: 1})
    .escape(),
  body('isbn', 'ISBN must not be empty.').trim().isLength({min: 1}).escape(),
  body('genre.*').escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    const {title, author, summary, isbn, genre} = req.body;
    // Extract the validation errors from the request.
    const errors = validationResult(req);

    // Create a book object with escaped and trimmed data.
    const book = new Book({
      title,
      author,
      summary,
      isbn,
      genre,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for the form.
      const [allAuthors, allGenres] = await Promise.all([
        Author.find().sort({family_name: 1}).exec(),
        Genre.find().sort({name: 1}).exec(),
      ]);

      // Mark our selected genres as marked.
      for (const genre of allGenres) {
        if (book.genre.includes(genre._id)) {
          genre.checked = 'true';
        }
      }

      res.render('book_form', {
        title: 'Create Book',
        authors: allAuthors,
        genres: allGenres,
        book,
        errors: errors.array(),
      });
    } else {
      // Data from the form is valid. Save book.
      await book.save();
      res.redirect(book.url);
    }
  }),
];

// Display Book delete form on GET
exports.book_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Book delete GET');
});

// Handle Book delete on POST
exports.book_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Book delete POST');
});

// Display Book update form on GET
exports.book_update_get = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  // Get book, authors and genres for the form.
  const [book, allAuthors, allGenres] = await Promise.all([
    Book.findById(id).populate('author').exec(),
    Author.find().sort({family_name: 1}).exec(),
    Genre.find().sort({name: 1}).exec(),
  ]);

  if (book === null) {
    // No results.
    const err = new Error('Book not found');
    err.status = 404;
    return next(err);
  }

  // Mark our selected genres as selected.
  allGenres.forEach((genre) => {
    if (book.genre.includes(genre._id)) genre.checked = true;
  });

  res.render('book_form', {
    title: 'Update Book',
    authors: allAuthors,
    genres: allGenres,
    book,
  });
});

// Handle Book update on POST
exports.book_update_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === 'undefined' ? [] : [req.body.genre];
    }
    next();
  },

  // Validate and sanitize the fields
  body('title', 'Title must not be empty.').trim().isLength({min: 1}).escape(),
  body('author', 'Author must not be empty.')
    .trim()
    .isLength({min: 1})
    .escape(),
  body('summary', 'Summary must not be empty.')
    .trim()
    .isLength({min: 1})
    .escape(),
  body('isbn', 'ISBN must not be empty').trim().isLength({min: 1}).escape(),
  body('genre.*').escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const {title, author, summary, isbn, genre = []} = req.body;
    //
    // Extract validation errors from the request.
    const errors = validationResult(req);

    const book = new Book({
      title,
      author,
      summary,
      isbn,
      genre,
      _id: id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      const [allAuthors, allGenres] = await Promise.all([
        Author.find().sort({family_name: 1}).exec(),
        Genre.find().sort({name: 1}).exec(),
      ]);

      // Mark our selected genre as checked.
      for (const genre of allGenres) {
        if (book.genre.indexOf(genre._id) > -1) {
          genre.checked = true;
        }
      }

      res.render('book_form', {
        title: 'Update Book',
        authors: allAuthors,
        genres: allGenres,
        book,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from the form is valid, Update the record.
      const updatedBook = await Book.findByIdAndUpdate(id, book, {});
      // Redirect to the book detail page.
      res.redirect(updatedBook.url);
    }
  }),
];
