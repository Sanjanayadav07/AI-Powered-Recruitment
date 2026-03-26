import { useState, useEffect } from "react";
import Login from "./components/Login";
import Builder from "./components/Builder";
import Dashboard from "./components/Dashboard"; // ✅ Candidate Dashboard
import RecruiterDashboard from "./components/RecruiterDashboard"; // ✅ Recruiter
import AdminDashboard from "./components/AdminDashboard"; // ✅ Admin Panel
import {
  loginUser,
  signupUser,
  saveProfile as saveAPI,
} from "./services/api";

export default function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [profile, setProfile] = useState({
    name: "",
    skills: "",
    about: "",
  });

  const [saving, setSaving] = useState(false);

  // 🔥 AUTO LOGIN (ROLE BASED)
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");

      //if (!savedUser) return;
      if (!savedUser) {
        setPage("login");
        return;
      }

      const parsed = JSON.parse(savedUser);

      // ✅ VALIDATION (VERY IMPORTANT)
      if (!parsed || !parsed._id || !parsed.role) {
        localStorage.removeItem("user");
        return;
      }

      setUser(parsed);

      if (parsed.role === "admin") {
        setPage("admin");
      } else if (parsed.profile?.name) {
        setPage("dashboard");
      } else {
        setPage("builder");
      }

    } catch (err) {
      localStorage.removeItem("user"); // corrupted data fix
    }
  }, []);

  // ✅ LOGIN
  const login = async () => {
    try {
      const res = await loginUser(form);

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      //setUser(res.data.user || res.data);
      //localStorage.setItem("user", JSON.stringify(res.data.user));

      /*🔥 ROLE BASED LOGIN
      if (res.data.role === "admin") {
        setPage("admin");
      } else {
        if (res.data.profile?.name) {
          setPage("dashboard");
        } else {
          setPage("builder");
        }
      }*/
      if (res.data.role === "admin") {
        setPage("admin");
      } else {
        if (res.data.profile?.name) {
          setPage("dashboard");
        } else {
          setPage("builder");
        }
      }

    } catch (err) {
      console.log("ERROR:", err);

      alert(err.response?.data?.message || err.response?.data || "Login failed ❌");
      //alert(err.response?.data || "Login failed ❌");
    }
  };

  // ✅ SIGNUP
  const signup = async () => {
    try {
      const res = await signupUser(form);

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));



      setPage("builder");

    } catch (err) {
      alert(err.response?.data || "Signup failed ❌");
    }
  };

  // ✅ SAVE PROFILE
  const saveProfile = async () => {
    if (!user?._id) {
      alert("User not found ❌");
      return;
    }

    setSaving(true);

    const res = await saveAPI(user._id, { profile });

    setSaving(false);

    // 🔥 UPDATE USER STATE + LOCAL STORAGE
    setUser(res.data);
    localStorage.setItem("user", JSON.stringify(res.data));

    setPage("dashboard");
  };

  // ✅ AI GENERATE
  const generateAI = () => {
    if (!profile.skills) {
      alert("Enter skills first ⚠️");
      return;
    }

    setProfile((prev) => ({
      ...prev,
      about: `Skilled in ${prev.skills} and passionate developer.`,
    }));
  };

  // 🔐 NOT LOGGED IN
  if (!user) {
    return (
      <Login
        form={form}
        setForm={setForm}
        login={login}
        signup={signup}
      />
    );
  }

  // 👨‍💻 BUILDER (CANDIDATE ONLY)
  if (page === "builder") {
    return (
      <Builder
        profile={profile}
        setProfile={setProfile}
        saveProfile={saveProfile}
        generateAI={generateAI}
        saving={saving}
        setPage={setPage}
      />
    );
  }

  // 👨‍💻 CANDIDATE DASHBOARD
  if (page === "dashboard") {
    if (user.role !== "candidate") {
      return <h1 className="text-center mt-20 text-xl">Access Denied ❌</h1>;
    }

    return (
      <Dashboard
        user={user}
        setUser={setUser}
        setPage={setPage}
      />
    );
  }

  // 👑 ADMIN DASHBOARD
  if (page === "admin") {
    if (user.role !== "admin") {
      return <h1 className="text-center mt-20 text-xl">Access Denied ❌</h1>;
    }

    return (
      <AdminDashboard
        setUser={setUser}
        setPage={setPage}
      />
    );
  }

  // recruiter
  if (page === "recruiter") {
    return (
      <RecruiterDashboard
        setUser={setUser}
        setPage={setPage}
      />
    );
  }


  return null;
}