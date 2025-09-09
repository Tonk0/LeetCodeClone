const express = require('express');
const { getFirstThreeTestCases } = require('../controllers/testcaseController');
const router = express.Router();

router.get('/firstThreeTestCases/:id', getFirstThreeTestCases)

module.exports = router;