import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import constants from "../config/constants.js";
import {sendUserInvitation, registerUser,fetchingRoles} from "../controllers/userController.js";


const router = express.Router();

router.get("/roles",
    authMiddleware,
    roleMiddleware(
        constants.roles.enterpriseAdmin,
        constants.roles.superAdmin,
        constants.roles.tenantSuperAdmin,
        constants.roles.tenantAdmin
    ),
    fetchingRoles
)

router.post("/invite",
    authMiddleware, 
    roleMiddleware(
        constants.roles.enterpriseAdmin,
        constants.roles.superAdmin,
        constants.roles.tenantSuperAdmin,
        constants.roles.tenantAdmin
    ),
    sendUserInvitation);
    
router.post("/register",registerUser);

export default router;