const express = require('express');
const router = express.Router();

const {enterpriseAdminLogin} = require('../controllers/enterpriseController');

router.post('/login',enterpriseAdminLogin)

module.exports = router;

