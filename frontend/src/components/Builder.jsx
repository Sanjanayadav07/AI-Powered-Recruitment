import { useState } from "react";

export default function Builder({
  profile,
  setProfile,
  saveProfile,
  saving,
  setPage,
}) {
  const [uploading, setUploading] = useState(false);

  // ✅ AI GENERATE
  const handleAI = () => {
    if (!profile.skills || profile.skills.trim() === "") {
      alert("Enter skills first ⚠️");
      return;
    }

    setProfile((prev) => ({
      ...prev,
      about: `Skilled in ${prev.skills} and passionate developer.`,
    }));
  };

  // ✅ IMAGE UPLOAD
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setProfile((prev) => ({
        ...prev,
        image: data.secure_url, // ✅ FIX
      }));
      alert("Image uploaded ✅");
    } catch (err) {
      alert("Upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  // ✅ RESUME UPLOAD
  const handleResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setProfile((prev) => ({
        ...prev,
        resume: data.secure_url, // ✅ FIX
      }));
      alert("Resume uploaded ✅");
    } catch (err) {
      alert("Upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  // ✅ SAVE
  const handleSubmit = async () => {
    await saveProfile();
    alert("Profile Saved ✅");
    setPage("dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">

        <h2 className="text-xl font-bold mb-4 text-center">
          Build Profile 🚀
        </h2>

        {/* NAME */}
        <input
          className="w-full border p-2 mb-3 rounded-lg"
          placeholder="Name"
          value={profile.name || ""}
          onChange={(e) =>
            setProfile({ ...profile, name: e.target.value })
          }
        />

        {/* SKILLS */}
        <input
          className="w-full border p-2 mb-3 rounded-lg"
          placeholder="Skills (e.g. React, Node)"
          value={profile.skills || ""}
          onChange={(e) =>
            setProfile({ ...profile, skills: e.target.value })
          }
        />

        {/* ABOUT */}
        <textarea
          className="w-full border p-2 mb-3 rounded-lg"
          placeholder="About"
          value={profile.about || ""}
          onChange={(e) =>
            setProfile({ ...profile, about: e.target.value })
          }
        />

        {/* IMAGE UPLOAD */}
        <label className="text-sm font-medium">Upload Profile Image</label>
        <input
          type="file"
          onChange={handleUpload}
          className="mb-3"
        />

        {/* IMAGE PREVIEW */}
        {profile.image && (
          <img
            src={profile.image}
            alt="profile"
            className="w-20 h-20 rounded-full mb-3"
          />
        )}

        {/* RESUME UPLOAD */}
        <label className="text-sm font-medium">Upload Resume (PDF)</label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleResume}
          className="mb-3"
        />

        {/* RESUME LINK */}
        {profile.resume && (
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 text-sm underline block mb-3"
          >
            View Resume
          </a>
        )}

        {/* AI BUTTON */}
        <button
          onClick={handleAI}
          type="button"
          className="w-full bg-purple-500 text-white py-2 rounded-lg mb-3"
        >
          ✨ Generate with AI
        </button>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={saving || uploading}
          className="w-full bg-green-500 text-white py-2 rounded-lg"
        >
          {saving
            ? "Saving..."
            : uploading
              ? "Uploading..."
              : "Save & Continue →"}
        </button>

      </div>
    </div>
  );
}