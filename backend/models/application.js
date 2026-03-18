
// models/Application.js

import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({

  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  },

  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  resume: {
    type: String
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  }

}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);