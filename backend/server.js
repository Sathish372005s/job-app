import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectToDatabase } from "./src/utils/dbutils.js";
import authroute from './src/route/authroute.js'
import jobroute from './src/route/jobroute.js'
import appl from './src/route/applicationroute.js'
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors({
  origin: '*'
}));
app.use(express.json());

app.use("/api/auth", authroute);
app.use('/api/job',jobroute)
app.use('/api/application',appl)

app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({ error: err.message || JSON.stringify(err) || "Unknown error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectToDatabase();
});