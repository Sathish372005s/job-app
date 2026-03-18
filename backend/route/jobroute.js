import express from "express";
import {createjob,getjobbyid,grtalljobs,deletejob} from "../controller/jobcontroller.js";
import { protectedroute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/createjob", protectedroute,createjob);
router.get("/getalljobs",protectedroute ,grtalljobs);
router.get("/getbyid/:id",protectedroute,getjobbyid)
router.delete("/deletejob/:id",protectedroute,deletejob)

export default router;