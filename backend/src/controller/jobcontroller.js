import job from "../models/job.js";
import Job from "../models/job.js"; 

export const createjob = async(req,res) => {
    try {
        const {title,description,salary,location,company,requirements} = req.body;
        if(!title || !description || !salary || !location || !company || !requirements){
            return res.status(400).json({message:"All fields required"});
        }
        const job = await Job.create({
            title,
            description,
            salary,
            location,
            company,
            requirements,
            postedBy:req.user._id
        })
        console.log(job);
        return res.status(201).json({message:"Job created successfully",job});
    } catch (error) {
        console.log("error in createjob",error);
        res.status(500).json({message:error.message});
    }
}

export const grtalljobs = async(req,res) => {
    try {
     const page =parseInt(req.query.page) || 1;
     const limit = parseInt(req.query.limit) || 5
     const skip=(page-1)*limit;
     const jobs =await  job.find().skip(skip).limit(limit).populate("postedBy","name email");
     const totalbooks =await Job.countDocuments();
     const totalpages = Math.ceil(totalbooks/limit);
     return res.status(200).json({message:"Jobs fetched successfully",jobs,totalbooks,totalpages});  
    } catch (error) {
        console.log("error in grtalljobs",error);
        res.status(500).json({message:error.message});
    }
}

export const jobfilter =async(req,res)=>{
    try {
        const {keyword,
            location,
            minSalary,
            maxSalary,
            experience,
            jobType,
            page = 1,
            limit = 5,
            sort = "latest",
        } =req.query;
        const filter ={};
        if(keyword){
            filter.$or = [
                {title:{$regex:keyword,$options:"i"}},
                {company:{$regex:keyword,$options:"i"}},
            ]
        }
        if(location){
            filter.location = {$regex:location,$options:"i"};
        }
        if(minSalary || maxSalary){
            filter.salary = {};
            if(minSalary){
                filter.salary.$gte = parseInt(minSalary);
            }
            if(maxSalary){
                filter.salary.$lte = parseInt(maxSalary);
            }
        }
        if(experience){
            filter.experience.$lte = parseInt(experience);
        }   
        if(jobType){
            filter.jobType = jobType;
        }
        const sortOrder = sort === "latest" ? -1 : 1;
        const skip = (page - 1) * limit;
        const jobs = await Job.find(filter).sort({createdAt:sortOrder}).skip(skip).limit(limit).populate("postedBy","name email");
        const totaljobs = await Job.countDocuments(filter);
        const totalpages = Math.ceil(totaljobs/limit);
        return res.status(200).json({message:"Jobs fetched successfully",jobs,totaljobs,totalpages});
    } catch (error) {
        console.log("error in jobfilter",error);
        res.status(500).json({message:error.message});
    }
}

export const getjobbyid = async(req,res) => {
    try {
            const {id} = req.params;
        const job = await Job.findById(id).populate("postedBy","name email");
        if(!job){
            return res.status(404).json({message:"Job not found"});
        }
        return res.status(200).json({message:"Job fetched successfully",job});
    } catch (error) {
        console.log("error in getjobbyid",error);
        res.status(500).json({message:error.message});
    }
}

export const deletejob = async(req,res) => {
    try {
        const {id} = req.params;
        const job = await Job.findById(id);
        if(!job){
            return res.status(404).json({message:"Job not found"});
        }
        await job.deleteOne();
        return res.status(200).json({message:"Job deleted successfully"});
    } catch (error) {
        console.log("error in deletejob",error);
        res.status(500).json({message:error.message});
    }
}