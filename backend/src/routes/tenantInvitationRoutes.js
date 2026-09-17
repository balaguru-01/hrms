import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import constants from "../config/constants.js";

import {
    sendTenantInvitation,
} from "../controllers/tenantInvitationController.js";

import {
    registerTenant,
} from "../controllers/tenantRegistrationController.js";

const router = express.Router();

// Send Tenant Invitation
router.post(
    "/invite",
    authMiddleware,
    roleMiddleware(
        constants.roles.enterpriseAdmin,
        constants.roles.superAdmin
    ),
    sendTenantInvitation
);

// Tenant Registration
router.post(
    "/register",
    registerTenant
);

export default router;