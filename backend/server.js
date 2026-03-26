import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/upload.js";

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

// ✅ ROOT ROUTE FIX
app.get("/", (req, res) => {
  res.send("AI Recruiter API running 🚀");
});

app.use("/", userRoutes);
app.use("/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});