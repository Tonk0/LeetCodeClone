const express = require('express');
const { getSubmissions } = require('../controllers/submissionsController');
const router = express.Router();

router.get('/', getSubmissions);

module.exports = router;