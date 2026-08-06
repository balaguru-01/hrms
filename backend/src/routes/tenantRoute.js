const express = require('express');
const { tenantAdminLogin, tenantProfile, verifyInvitation, createTenant } = require('../controllers/tenantController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const { adminProfile } = require('../controllers/enterpriseController');

const router = express.Router();

router.post('/login',tenantAdminLogin)
router.get('/profile',authMiddleware,roleMiddleware("tenantadmin"),tenantProfile)
router.get('/onboarding/verify',verifyInvitation)
router.post('/onboarding/create',createTenant)

module.exports = router;