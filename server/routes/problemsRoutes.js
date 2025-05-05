const express = require('express');
const router = express.Router();
const { getProblems, getNumOfPage, getProblem, getSubmissionsForProblem } = require('../controllers/problemsController');

router.get('/', getProblems)
router.get('/pageCount', getNumOfPage )
router.get('/:id', getProblem)
router.get('/:id/submissions', getSubmissionsForProblem)


module.exports = router;