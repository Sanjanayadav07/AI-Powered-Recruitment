import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js"; // ✅ FIX
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    // ❗ check file
    if (!req.file) {
      return res.status(400).json("No file uploaded ❌");
    }

    // ✅ FIXED STREAM WITH PROMISE
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "profiles" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    res.json({ url: result.secure_url });

  } catch (err) {
    console.log("UPLOAD ERROR:", err); // 👈 DEBUG
    res.status(500).json("Upload failed ❌");
  }
});

export default router;