import express from "express";
import {createjob,getjobbyid,grtalljobs,deletejob,jobfilter} from "../controller/jobcontroller.js";
import { protectedroute } from "../middleware/auth.middleware.js";
import { protectrole } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/createjob", protectedroute,protectrole("recruiter"),createjob);
router.get("/getalljobs",protectedroute ,protectrole("recruiter","jobseeker"),grtalljobs);
router.get("/getbyid/:id",protectedroute,protectrole("recruiter","jobseeker"),getjobbyid)
router.delete("/deletejob/:id",protectedroute,protectrole("recruiter"),deletejob)
router.get("/filter",protectedroute,protectrole("recruiter","jobseeker"),jobfilter)

export default router;