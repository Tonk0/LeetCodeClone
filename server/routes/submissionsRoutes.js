const express = require('express');
const { getSubmissions, getNumOfPage } = require('../controllers/submissionsController');
const router = express.Router();

router.get('/', getSubmissions);
router.get('/pageCount', getNumOfPage);

module.exports = router;