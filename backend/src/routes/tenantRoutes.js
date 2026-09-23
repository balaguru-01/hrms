import express from "express";

import {
  sendTenantInvitation,
} from "../controllers/tenantInvitationController.js";

import {
  registerTenant,
  validateTenantInvitation,
} from "../controllers/tenantRegistrationController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

import roleMiddleware from "../middlewares/roleMiddleware.js";

import constants from "../config/constants.js";

import {
  getTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
} from "../controllers/tenantController.js";

const router = express.Router();

// ---------------------------------------
// GET ALL TENANTS
// ---------------------------------------

router.get(
  "/",
  authMiddleware,
  roleMiddleware(
    constants.roles.enterpriseAdmin,
    constants.roles.superAdmin
  ),
  getTenants
);

// ---------------------------------------
// VALIDATE TENANT INVITATION
// ---------------------------------------

router.post(
  "/invitation/validate",
  validateTenantInvitation
);

// ---------------------------------------
// GET SINGLE TENANT
// ---------------------------------------

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(
    constants.roles.enterpriseAdmin,
    constants.roles.superAdmin
  ),
  getTenantById
);

// ---------------------------------------
// UPDATE TENANT
// ---------------------------------------

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(
    constants.roles.enterpriseAdmin,
    constants.roles.superAdmin
  ),
  updateTenant
);

// ---------------------------------------
// DELETE TENANT
// ---------------------------------------

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(
    constants.roles.enterpriseAdmin,
    constants.roles.superAdmin
  ),
  deleteTenant
);

// ---------------------------------------
// TENANT INVITATION
// ---------------------------------------

router.post(
  "/invite",
  authMiddleware,
  roleMiddleware(
    constants.roles.enterpriseAdmin,
    constants.roles.superAdmin
  ),
  sendTenantInvitation
);

// ---------------------------------------
// TENANT REGISTRATION
// ---------------------------------------

router.post(
  "/register",
  registerTenant
);

export default router;