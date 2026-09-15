import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import constants from "../config/constants.js";

import {
    sendUserInvitation,
    registerUser,
    fetchRoles,
    fetchUsers,
    getSentInvitations,
} from "../controllers/userController.js";

const router = express.Router();

router.post(
    "/roles",
    authMiddleware,
    roleMiddleware(
        constants.roles.enterpriseAdmin,
        constants.roles.superAdmin,
        constants.roles.tenantSuperAdmin,
        constants.roles.tenantAdmin
    ),
    fetchRoles
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware(
        constants.roles.enterpriseAdmin,
        constants.roles.superAdmin,
        constants.roles.tenantSuperAdmin,
        constants.roles.tenantAdmin
    ),
    fetchUsers
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

router.post(
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