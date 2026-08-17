import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import {sendUserInvitation, registerUser }from "../controllers/userController.js";


const router = express.Router();


router.post("/invite",authMiddleware,sendUserInvitation);
router.post("/register",registerUser);

export default router;