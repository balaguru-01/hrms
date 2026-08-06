const express = require("express");
const router = express.Router();

const {
    enterpriseAdminLogin,
    adminProfile,
    inviteTenant,
    getPendingApprovals,
    viewPendingTenant,
    approvePendingTenant,
    rejectPendingTenant
} = require("../controllers/enterpriseController");

const { authMiddleware } = require("../middlewares/authMiddleware");
const { roleMiddleware } = require("../middlewares/roleMiddleware");

router.post("/login", enterpriseAdminLogin);
router.get("/profile",authMiddleware,roleMiddleware("enterpriseadmin"),adminProfile);

router.post("/tenant/invite",authMiddleware,roleMiddleware("enterpriseadmin"),inviteTenant);
router.get("/tenant/pending",authMiddleware,roleMiddleware("enterpriseadmin"),getPendingApprovals);
router.get("/tenant/pending/:tenantId",authMiddleware,roleMiddleware("enterpriseadmin"),viewPendingTenant);
router.post("/tenant/pending/:tenantId/approve",authMiddleware,roleMiddleware("enterpriseadmin"),approvePendingTenant);
router.post("/tenant/pending/:tenantId/reject",authMiddleware,roleMiddleware("enterpriseadmin"),rejectPendingTenant);

module.exports = router;