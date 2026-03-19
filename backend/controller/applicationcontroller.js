import Application from "../models/application.js";

import Job from "../models/job.js";

export const applyforjob = async(req,res) => {
    try {
        const { jobId } = req.body;
        if (!jobId) {
            return res.status(400).json({ message: "Job ID required" });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        const existingApplication = await Application.findOne({ job: jobId, applicant: req.user._id });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }

        const resume = req.file ? req.file.path : null;
        const application = new Application ({
            job: jobId,
            applicant: req.user._id,
            resume
        });
        await application.save();
        return res.status(201).json({ message: "Application submitted successfully", application });
    } catch (error) {
        console.log("error from applyforjob",error);
        return res.status(500).json({ message: "error in applying for job" });
    }
}

export const getmyapplications = async(req,res) => {
    try {
        const applications = await Application.find({ applicant: req.user._id }).populate("job", "title company location");
        if(!applications){
            return res.status(404).json({ message: "No applications found" });
        }
        return res.status(200).json({ applications });
    } catch (error) {
        console.log("error from getmyapplications",error);
        return res.status(500).json({ message: "error in getting my applications" });
    }

}

export  const updatestatus = async(req,res) =>{
    try {
        const {id}=req.params;
        const {status} =req.body;
        const application = await Application.findById({id})
        if(!application){
            res.status(404).json({message:"Application not found"})
        }
        application.status = status;
        await application.save();
        return res.status(200).json({message:"Application status updated successfully",application})
    } 
    catch (error) {
        console.log("error from updatestatus",error);
        return res.status(500).json({message:"error in updating status"});
    }
}
