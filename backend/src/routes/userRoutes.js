import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import constants from "../config/constants.js";

import {
    sendUserInvitation,
    registerUser,
    fetchingRoles,
    fetchingUsers,
    getSentInvitations
} from "../controllers/userController.js";

const router = express.Router();

router.get(
    "/roles",
    authMiddleware,
    roleMiddleware(
        constants.roles.enterpriseAdmin,
        constants.roles.superAdmin,
        constants.roles.tenantSuperAdmin,
        constants.roles.tenantAdmin
    ),
    fetchingRoles
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware(
        constants.roles.enterpriseAdmin,
        constants.roles.superAdmin,
        constants.roles.tenantSuperAdmin,
        constants.roles.tenantAdmin
    ),
    fetchingUsers
);

router.post(
    "/invite",
    authMiddleware,
    roleMiddleware(
        constants.roles.enterpriseAdmin,
        constants.roles.superAdmin,
        constants.roles.tenantSuperAdmin,
        constants.roles.tenantAdmin
    ),
    sendUserInvitation
);

router.get(
    "/invitations",
    authMiddleware,
    roleMiddleware(
        constants.roles.enterpriseAdmin,
        constants.roles.superAdmin,
        constants.roles.tenantSuperAdmin,
        constants.roles.tenantAdmin
    ),
    getSentInvitations
);

router.post(
    "/register",
    registerUser 
);

export default router;