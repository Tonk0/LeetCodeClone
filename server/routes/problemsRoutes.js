const express = require('express');
const router = express.Router();
const {submissionLimiter} = require('../containersConfig')
const { getProblems, getNumOfPage, getProblem, getSubmissionsForProblem, getTemplate, postSubmission } = require('../controllers/problemsController');

router.get('/', getProblems)
router.get('/pageCount', getNumOfPage )
router.get('/:id', getProblem)
router.get('/:id/submissions', getSubmissionsForProblem)
router.get('/:id/template', getTemplate)
router.post('/:id/sendCode', submissionLimiter, postSubmission)


module.exports = router;