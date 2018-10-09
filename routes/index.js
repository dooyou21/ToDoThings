const express = require('express');
const router = express.Router();
const executeQuery = require('../models/database');

/* GET home page. */
router.get('/', (req, res, next) => {
  console.log(req.user);
  res.render('index', { title: 'ToDoThings Server', user: req.user });
});

module.exports = router;
