const router = require('express').Router();
const { sendWish } = require('../controllers/wishController');

router.post('/send-wish', sendWish);

module.exports = router;