import express from "express";
import {signup,login,logout,updateProfile} from "../controller/authcontroller.js";
import { protectedroute } from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", signup);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/logout
router.post("/logout", logout);

router.put("/updateprofile",protectedroute,updateProfile)

export default router;