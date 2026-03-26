export default function Dashboard({ user, setUser, setPage }) {
  const profile = user?.profile;

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setPage("login"); // ✅ IMPORTANT FIX
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center hover:scale-105 transition">

        <h1 className="text-xl font-bold mb-4">
          My Profile 👤
        </h1>

        {/* ✅ PROFILE IMAGE */}
        {profile?.image && (
          <img
            src={profile.image}
            alt="profile"
            className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
          />
        )}

        <h2 className="font-semibold text-lg">
          {profile?.name || "No Name"}
        </h2>

        <p className="text-gray-600 text-sm">
          {profile?.skills || "No Skills"}
        </p>

        <p className="text-sm mt-2 text-gray-500">
          {profile?.about || "No Description"}
        </p>

        {/* ✅ RESUME */}
        {profile?.resume && (
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 text-sm underline block mt-2"
          >
            View Resume 📄
          </a>
        )}

        {/* ✅ ROLE SHOW (BONUS) */}
        <p className="text-xs text-gray-400 mt-2">
          Role: {user?.role}
        </p>

        {/* EDIT */}
        <button
          onClick={() => setPage("builder")}
          className="mt-4 w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
        >
          Edit Profile
        </button>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="mt-2 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
}