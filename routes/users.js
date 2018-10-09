const express = require('express');
const router = express.Router();
const executeQuery = require('../models/database');
const { isLoggedIn } = require('./middlewares');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/profile', isLoggedIn, async (req, res, next) => {
    const result = await executeQuery(`select userId, userName, email from user 
    where userId = ?
    and deletedAt is null`, [ req.user.userId ]);
    res.json(result.rows);
});

module.exports = router;
