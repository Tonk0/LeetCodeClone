const experss = require('express');
const router = experss.Router();
const { getTags } = require('../controllers/tagsController'); 
router.get('/', getTags);

module.exports = router;