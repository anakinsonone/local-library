const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/login', userController.user_login_get);

router.post('/login', userController.user_login_post);

router.get('/register', userController.user_register_get);

router.post('/register', userController.user_register_post);

module.exports = router;
