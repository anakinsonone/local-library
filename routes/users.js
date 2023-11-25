const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET users/cool listing. */
router.get('/cool', function(req, res) {
  res.send('You\'re so cool!');
});

module.exports = router;
