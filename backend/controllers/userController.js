import User from "../models/User.js";

// Signup
/*
export const signup = async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
};
*/

export const signup = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.create({
    email,
    password,
    role: "candidate", // 🔒 force candidate
  });

  res.json(user);
};


// Login
export const login = async (req, res) => {
  let { email, password } = req.body;

  // 🔥 TRIM FIX
  email = email.trim();
  password = password.trim();

  console.log("EMAIL:", `"${email}"`);

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found ❌" });
   // return res.status(400).json("User not found ❌");
  }

  if (user.password !== password) {
    return res.status(400).json({ message: "Wrong password ❌" });
   // return res.status(400).json("Wrong password ❌");
  }

  res.json({
    _id: user._id,
    email: user.email,
    role: user.role,
    profile: user.profile,
  });
};

// Save Profile
export const saveProfile = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { profile: req.body.profile },
    { new: true }
  );

  res.json(user);
};

// Get Candidates
export const getCandidates = async (req, res) => {
  const users = await User.find({ role: "candidate" }); // ✅ filter
  res.json(users);
};

// Seed Demo User
export const seedUser = async (req, res) => {
  await User.create({
    email: "hire-me@anshumat.org",
    password: "HireMe@2025!",
    role: "admin", // 🔥 IMPORTANT FIX
    profile: {
      name: "Admin Recruiter",
      skills: "Hiring, Management",
      about: "Recruiter Dashboard Access",
    },
  });

  res.send("Admin Seeded ✅");
};