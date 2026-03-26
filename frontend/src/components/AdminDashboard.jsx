
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard({ setUser, setPage }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 CURRENT ADMIN
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await axios.get("http://localhost:5000/candidates");

      // ✅ SAFETY FILTER (only candidates)
      const filtered = res.data.filter((u) => u.role === "candidate");

      setUsers(filtered);
    } catch (err) {
      console.error(err);
      alert("Failed to load users ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ DELETE USER
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/user/${id}`);
      alert("User deleted ✅");
      load();
    } catch (err) {
      alert("Delete failed ❌");
    }
  };

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setPage("login");
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-10">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">

        <h1 className="text-2xl font-bold">
          Admin Panel 👑
        </h1>

        <div className="flex gap-2">

          <button
            onClick={() => setPage("recruiter")}
            className="bg-purple-500 text-white px-3 py-2 rounded-lg"
          >
            ← Back
          </button>

          <button
            onClick={handleLogout}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>
      </div>

      {/* 🔥 ADMIN PROFILE */}
      <div className="bg-white p-5 rounded-2xl shadow mb-8 max-w-md">
        <h2 className="font-bold text-lg mb-2">Admin Profile 👑</h2>

        <p className="font-semibold">{currentUser?.email}</p>

        <p className="text-sm text-gray-500">
          Role: {currentUser?.role}
        </p>
      </div>

      {/* USERS */}
      {users.length === 0 ? (
        <p className="text-gray-500">No candidates found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((u) => (
            <div
              key={u._id}
              className="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition-all duration-300 hover:scale-105"
            >

              {/* PROFILE */}
              <div className="flex items-center gap-3 mb-3">
                {u.profile?.image ? (
                  <img
                    src={u.profile.image}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-400 text-white rounded-full">
                    {u.profile?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}

                <div>
                  <h2 className="font-semibold">
                    {u.profile?.name || "No Name"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {u.email}
                  </p>
                </div>
              </div>

              {/* SKILLS */}
              <p className="text-sm text-gray-600 mb-2">
                {u.profile?.skills || "No skills"}
              </p>

              {/* DELETE */}
              <button
                onClick={() => deleteUser(u._id)}
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 active:scale-95 transition"
              >
                Delete User 🗑️
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}