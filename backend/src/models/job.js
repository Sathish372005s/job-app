// models/Job.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String },
    salary: { type: Number },
    description: { type: String },

    skillsRequired: {
      type: [String],
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Temporary", "Internship"],
      default: "Full-time",
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);