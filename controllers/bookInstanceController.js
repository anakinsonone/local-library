const BookInstance = require('../models/bookinstance');
const Book = require('../models/book');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');
const bookinstance = require('../models/bookinstance');

// Display list of all BookInstances
exports.bookinstance_list = asyncHandler(async (req, res, next) => {
  const allBookInstances = await BookInstance.find().populate('book').exec();

  res.render('bookinstance_list', {
    title: 'Book Instance List',
    bookinstance_list: allBookInstances,
  });
});

// Display details page for a specific BookInstance
exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
  const {params} = req;
  const {id} = params;

  const bookInstance = await BookInstance.findById(id).populate('book').exec();

  if (bookInstance === null) {
    const err = new Error('Book copy not found.');
    err.status = 400;
    return next(err);
  }

  res.render('bookinstance_detail', {
    title: 'Book:',
    bookInstance,
  });
});

// Display BookInstance create form on GET
exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
  const allBooks = await Book.find({}, 'title').sort({title: 1}).exec();

  res.render('bookinstance_form', {
    title: 'Create BookInstance',
    book_list: allBooks,
  });
});

// Handle BookInstance create on POST
exports.bookinstance_create_post = [
  body('book', 'Book must be specified').trim().isLength({min: 1}).escape(),
  body('imprint', 'Imprint must be specified.')
    .trim()
    .isLength({min: 1})
    .escape(),
  body('status').escape(),
  body('due_back', 'Invalid date')
    .optional({values: 'falsy'})
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    const {body} = req;
    const {book, imprint, status, due_back} = body;
    const errors = validationResult(req);

    const bookInstance = new BookInstance({
      book,
      imprint,
      status,
      // eslint-disable-next-line camelcase
      due_back,
    });

    if (!errors.isEmpty()) {
      const allBooks = await Book.find({}, 'title').sort({title: 1}).exec();

      res.render('bookinstance_form', {
        title: 'Create BookInstance',
        book_list: allBooks,
        selected_book: bookInstance.book._id,
        errors: errors.array(),
        bookinstance: bookInstance,
      });
      return;
    } else {
      await bookInstance.save();
      const {url} = bookInstance;
      res.redirect(url);
    }
  }),
];

// Display BookInstance delete form on GET
exports.bookinstance_delete_get = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const bookInstance = await Promise.resolve(
    BookInstance.findById(id).populate('book').exec(),
  );

  if (bookinstance === null) {
    res.redirect('/catalog/bookinstances');
  }

  res.render('bookinstance_delete', {
    title: 'Delete BookInstance',
    bookInstance,
  });
});

// Handle BookInstance delete on POST
exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
  const {bookInstanceID} = req.body;
  await BookInstance.findByIdAndDelete(bookInstanceID);
  res.redirect('/catalog/bookinstances');
});

// Display BookInstance update form on GET
exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  // Get book, all books for the form.
  const [bookInstance, allBooks] = await Promise.all([
    BookInstance.findById(id).populate('book').exec(),
    Book.find().exec(),
  ]);

  if (bookInstance === null) {
    // No results.
    const err = new Error('Book copy not found.');
    err.status = 404;
    return next(err);
  }

  console.log(bookInstance);
  res.render('bookinstance_form', {
    book_list: allBooks,
    selected_book: bookInstance._id,
    bookinstance: bookInstance,
  });
});

// Handle BookInstance update on POST
exports.bookinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: BookInstance update POST');
});
