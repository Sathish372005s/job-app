import express from "express";
import {applyforjob,getmyapplications,updatestatus} from "../controller/applicationcontroller.js";
import { protectedroute } from "../middleware/auth.middleware.js";
import { protectrole } from "../middleware/role.middleware.js"; 
import upload from "../middleware/resume.middleware.js";

const router = express.Router();


router.post("/apply", protectedroute,protectrole("jobseeker"),upload.single("resume"),applyforjob);
router.get("/my",protectedroute ,protectrole("jobseeker"),getmyapplications);
router.put("/update/:id/status",protectedroute,protectrole("recruiter"),updatestatus);  

export default router;