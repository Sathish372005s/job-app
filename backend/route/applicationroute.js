import express from "express";
import {applyforjob,getmyapplications} from "../controller/applicationcontroller.js";
import { protectedroute } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/apply", protectedroute,applyforjob);
router.get("/my",protectedroute ,getmyapplications);

export default router;