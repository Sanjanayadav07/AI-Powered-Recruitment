import dotenv from "dotenv";   // ✅ FIRST
dotenv.config();               // ✅ SECOND

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/upload.js";

const app = express();

app.use(express.json());
app.use(cors());

connectDB(); // now env is safe

app.use("/", userRoutes);
app.use("/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});