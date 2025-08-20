const express = require('express');
const { getSubmissions, getNumOfPage, postSubmission } = require('../controllers/submissionsController');
const router = express.Router();

router.get('/', getSubmissions);
router.get('/pageCount', getNumOfPage);
// router.post('/sendCode', postSubmission);

module.exports = router;