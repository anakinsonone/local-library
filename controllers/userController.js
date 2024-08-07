const {body, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const asyncHandler = require('express-async-handler');

exports.user_register_get = asyncHandler(async (req, res, next) => {
  res.render('user_register_form', {
    title: 'Local Library | Sign Up',
  });
});

exports.user_register_post = [
  body('name', 'Name must be provided')
    .trim()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('Name must contain only letters and spaces')
    .isLength({min: 5, max: 30})
    .withMessage('Name must be 5-10 characters long')
    .escape(),
  body('email', 'Email must be provided.').trim().isEmail().escape(),
  body('password', 'Password must be provided')
    .trim()
    .isStrongPassword({
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minLowercase: 1,
      minUppercase: 1,
    })
    .trim(),

  asyncHandler(async (req, res, next) => {
    const {name, email, password} = req.body;
    const errors = validationResult(req);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    if (!errors.isEmpty()) {
      res.render('user_register_form', {
        title: 'Local Library | Sign Up',
        errors: errors.array(),
      });
      return;
    } else {
      await user.save();
      res.redirect('/catalog');
    }
  }),
];

exports.user_login_get = asyncHandler(async (req, res, next) => {
  res.render('user_login_form', {
    title: 'Local Library | Login',
  });
});

exports.user_login_post = [
  body('email', 'Email must be provided.').trim().isEmail().escape(),
  body('password', 'Password must be provided')
    .trim()
    .isStrongPassword({
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minLowercase: 1,
      minUppercase: 1,
    })
    .trim(),

  asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;
    const errors = validationResult(req);

    const userExists = await User.findOne({email});

    if (!userExists) {
      res.render('user_login_form', {
        title: 'Local Library | Login',
        errors: [{msg: 'User is not registered.'}],
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, userExists.password);

    if (!passwordMatch) {
      res.render('user_login_form', {
        title: 'Local Library | Login',
        errors: [{msg: 'Invalid Login Credentials'}],
      });
      return;
    }

    if (!errors.isEmpty()) {
      res.render('user_login_form', {
        title: 'Local Library | Login',
        errors: errors.array(),
      });
      return;
    } else {
      res.redirect('/catalog');
    }
  }),
];
