import { useEffect, useState } from "react";
import { getCandidates } from "../services/api";
import { motion } from "framer-motion";

export default function Dashboard({ setUser, setPage }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [shortlisted, setShortlisted] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const calculateScore = (profile) => {
  let score = 0;

  if (!profile) return 0;

  const skills = profile.skills?.toLowerCase() || "";

  // 🔥 skills based
  if (skills.includes("react")) score += 30;
  if (skills.includes("node")) score += 30;
  if (skills.includes("mongodb")) score += 20;
  if (skills.includes("javascript")) score += 20;

  // 🔥 profile completeness
  if (profile.name) score += 10;
  if (profile.about) score += 10;

  return score;
};

  useEffect(() => {
    load();
  }, []);

 const load = async () => {
  try {
    const res = await getCandidates();

    // 🔥 FIX: ensure only candidates
    const filtered = res.data.filter((u) => u.role === "candidate");

    setUsers(filtered);

  } catch (err) {
    console.log(err);
    alert("Failed to load candidates ❌");
  } finally {
    setLoading(false);
  }
};

  // 🔍 FILTER
  const filteredUsers = users.filter((u) =>
    u.profile?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ⭐ SHORTLIST
  const toggleShortlist = (id) => {
    if (shortlisted.includes(id)) {
      setShortlisted(shortlisted.filter((i) => i !== id));
    } else {
      setShortlisted([...shortlisted, id]);
    }
  };

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setPage("login");
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="text-center mt-20 text-lg">
        Loading candidates...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-10">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">

        <h1 className="text-2xl font-bold">
          Recruiter Dashboard 👩‍💼
        </h1>

        <div className="flex gap-2 w-full sm:w-auto">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search candidates..."
            className="border px-4 py-2 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-purple-400 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* ADMIN */}
          <button
            onClick={() => setPage("admin")}
            className="bg-purple-500 text-white px-3 py-2 rounded-lg"
          >
            Admin
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>
      </div>

      {/* CARDS */}
      {filteredUsers.length === 0 ? (
        <p className="text-gray-500">No candidates found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((u) => (
            <div
              key={u._id}
              onClick={() => setSelected(u)}
              className="bg-white p-5 rounded-2xl shadow hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
            >

              {/* AVATAR */}
              <div className="flex items-center gap-3 mb-3">
                {u.profile?.image ? (
                  <img
                    src={u.profile.image}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-purple-500 text-white rounded-full font-bold">
                    {u.profile?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}

                <div>
                  <h2 className="font-semibold capitalize">
                    {u.profile?.name || "No Name"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {u.profile?.skills || "No Skills"}
                  </p>

                  {/* SCORE */}
                  <p className="text-xs text-green-600 font-semibold">
                    
                    Score: {calculateScore(u.profile)}
                  </p>
                </div>
              </div>

              {/* ABOUT */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {u.profile?.about || "No description"}
              </p>

              {/* RESUME */}
              {u.profile?.resume && (
                <a
                  href={u.profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 text-xs underline block mb-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Resume 📄
                </a>
              )}

              {/* SHORTLIST BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleShortlist(u._id);
                }}
                className={`w-full py-2 rounded-lg text-white transition active:scale-95 ${
                  shortlisted.includes(u._id)
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {shortlisted.includes(u._id)
                  ? "Remove"
                  : "Shortlist"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setSelected(null)}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-xl w-80 shadow-xl"
          >
            <h2 className="font-bold text-lg mb-2">
              {selected.profile?.name}
            </h2>

            {selected.profile?.image && (
              <img
                src={selected.profile.image}
                className="w-16 h-16 rounded-full mb-2"
              />
            )}

            <p className="text-sm text-gray-600">
              {selected.profile?.skills}
            </p>

            <p className="text-sm mt-2 text-gray-500">
              {selected.profile?.about}
            </p>

            {selected.profile?.resume && (
              <a
                href={selected.profile.resume}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 text-sm underline block mt-2"
              >
                View Resume 📄
              </a>
            )}

            <button
              className="mt-4 bg-gray-800 text-white px-3 py-1 rounded w-full"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

