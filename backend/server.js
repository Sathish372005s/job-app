import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectToDatabase } from "./src/utils/dbutils.js";
import authroute from './src/route/authroute.js'
import jobroute from './src/route/jobroute.js'
import appl from './src/route/applicationroute.js'

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authroute);
app.use('/api/job',jobroute)
app.use('/api/application',appl)

app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({ error: err.message || JSON.stringify(err) || "Unknown error" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
  connectToDatabase();
});