const express = require('express');
const router = express.Router();
const f11Controller = require('../controllers/f11');

router.post('/login', f11Controller.login);
router.get('/candidate/:id', f11Controller.getCandidate);

module.exports = router;
