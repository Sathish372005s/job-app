import Application from "../models/application.js";
import Job from "../models/job.js";
import nodemailer from "nodemailer";
const dotenv = await import("dotenv");
dotenv.config();

let transporter;
const getTransporter = () => {
    if (transporter) {
        return transporter;
    }else{
        transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });
        return transporter;
    };
}
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
        const application = await Application.findById(id)
            .populate("applicant", "name email")
            .populate("job", "title");

        if(!application){
            return res.status(404).json({message:"Application not found"})
        }
        application.status = status;
        await application.save();

        if (application.applicant && application.applicant.email) {
            try {
                await getTransporter().sendMail({
                    from: process.env.EMAIL_USER,
                    to: application.applicant.email,
                    subject: `Application ${status}`,
                    text: `Hi ${application.applicant.name},\n\nYour application for ${application.job.title} has been ${status}.\n\nThank you.`,
                });
            } catch (mailError) {
                console.log("Error sending email:", mailError);
            }
        }

        return res.status(200).json({message:"Application status updated successfully",application})
    } 
    catch (error) {
        console.log("error from updatestatus",error);
        return res.status(500).json({message:"error in updating status"});
    }
}

export const getApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email")
      .populate("job", "title company");

    if (applications.length === 0) {
      return res.status(404).json({ message: "No applicants found" });
    }
    return res.status(200).json({ applications });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Error fetching applicants" });
  }
};

