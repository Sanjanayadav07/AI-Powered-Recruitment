import express from "express";
import mongoose from "mongoose";

import User from "../models/User.js"; // ✅ IMPORTANT
import {
  signup,
  login,
  saveProfile,
  seedUser,
} from "../controllers/userController.js";

const router = express.Router();

// AUTH
router.post("/signup", signup);
router.post("/login", login);

// PROFILE
router.post("/profile/:id", saveProfile);

// ⭐ SHORTLIST
router.post("/shortlist", async (req, res) => {
  try {
    const { userId, candidateId } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json("User not found");

    if (user.shortlisted.includes(candidateId)) {
      user.shortlisted = user.shortlisted.filter(
        (id) => id.toString() !== candidateId
      );
    } else {
      user.shortlisted.push(candidateId);
    }

    await user.save();
    res.json(user.shortlisted);

  } catch (err) {
    console.log(err);
    res.status(500).json("Shortlist error ❌");
  }
});

// 🔥 SINGLE CLEAN CANDIDATES API (WITH RANKING)
router.get("/candidates", async (req, res) => {
  try {
    const users = await User.find();

    const ranked = users.map((u) => {
      let score = 0;

      if (u.profile?.skills)
        score += u.profile.skills.split(",").length * 10;

      if (u.profile?.about) score += 20;

      return { ...u._doc, score };
    });

    ranked.sort((a, b) => b.score - a.score);

    res.json(ranked);

  } catch (err) {
    res.status(500).json("Error fetching candidates");
  }
});

// ADMIN DELETE

router.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log("DELETE ID:", id);

    // ✅ ID VALIDATION
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json("Invalid ID ❌");
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json("User not found ❌");
    }

    res.json("User deleted ✅");

  } catch (err) {
    console.log("DELETE ERROR:", err); // 👈 MUST CHECK
    res.status(500).json("Delete failed ❌");
  }
});

// TEST DATA
router.get("/seed", seedUser);

export default router;