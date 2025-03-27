const express = require('express');
const router = express.Router();
const { getProblems, getNumOfPage } = require('../controllers/problemsController');

router.get('/', getProblems)
router.get('/:id')
router.get('/pageCount', getNumOfPage )

module.exports = router;