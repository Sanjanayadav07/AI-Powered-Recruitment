export default function Login({ form, setForm, login, signup }) {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-80">
        <h1 className="text-2xl font-bold text-center mb-6">
          AI Recruiter 🚀
        </h1>
        <input
          className="w-full border p-2 mb-3 rounded-lg"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="w-full border p-2 mb-4 rounded-lg"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />


        <div className="flex gap-2">
          <button
            onClick={login}
            className="w-full bg-purple-500 text-white py-2 rounded-lg"
          >
            Login
          </button>

          <button
            onClick={signup}
            className="w-full bg-green-500 text-white py-2 rounded-lg"
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}