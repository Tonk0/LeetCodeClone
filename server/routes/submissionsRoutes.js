const express = require('express');
const { getSubmissions, getNumOfPage, getSubmission, postSubmission } = require('../controllers/submissionsController');
const router = express.Router();

router.get('/', getSubmissions);
router.get('/pageCount', getNumOfPage);
router.get('/:id', getSubmission);
// router.post('/sendCode', postSubmission);

module.exports = router;