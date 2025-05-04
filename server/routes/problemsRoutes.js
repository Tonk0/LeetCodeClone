const express = require('express');
const router = express.Router();
const { getProblems, getNumOfPage, getProblem } = require('../controllers/problemsController');

router.get('/', getProblems)
router.get('/pageCount', getNumOfPage )
router.get('/:id', getProblem)


module.exports = router;