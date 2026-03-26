import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: {
    type: String,
    enum: ["admin", "candidate"],
    default: "candidate",
  },
    profile: {
        name: String,
        skills: String,
        about: String,
        resume: String,
        image: String,
    },
    shortlisted: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

export default mongoose.model("User", userSchema);