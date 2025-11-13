import React, { useState } from "react";
import Topbar from "../scenes/global/Topbar";
import Sidebarr from "../scenes/global/Sidebar";

export default function UserProfile() {
  const [profile, setProfile] = useState({
    name: "ADMIN",
    position: "Administrator",
    email: "admin@example.com",
    password: "password123",
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile, confirmPassword: profile.password });
  const [message, setMessage] = useState(null);

  const startEdit = () => {
    setForm({ ...profile, confirmPassword: profile.password });
    setMessage(null);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setMessage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setMessage({ type: "error", text: "Name is required." });
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      return setMessage({ type: "error", text: "Valid email is required." });
    if (form.password !== form.confirmPassword)
      return setMessage({ type: "error", text: "Passwords do not match." });

    setProfile({
      name: form.name,
      position: form.position,
      email: form.email,
      password: form.password,
    });
    setEditing(false);
    setMessage({ type: "success", text: "Profile updated successfully." });
  };

  return (
    <div className="flex bg-gray-50 h-screen overflow-hidden">
      <Sidebarr />
      <div className="flex flex-col flex-1">
        <div className="flex-none">
          <Topbar />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-bold shadow-sm">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-semibold mt-4 text-gray-800">{profile.name}</h2>
              <p className="text-gray-500">{profile.position}</p>
            </div>

            {!editing ? (
              <div className="space-y-4 text-gray-700">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p><span className="font-semibold text-gray-800">Name:</span> {profile.name}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p><span className="font-semibold text-gray-800">Position:</span> {profile.position || "—"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p><span className="font-semibold text-gray-800">Email:</span> {profile.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p><span className="font-semibold text-gray-800">Password:</span> ••••••••</p>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={startEdit}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <input
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>

                <div className="border-t pt-3">
                  <p className="text-sm text-gray-500 mb-2">Change Password</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>
                </div>

                {message && (
                  <div
                    className={`text-sm font-medium mt-2 ${
                      message.type === "error" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <div className="flex justify-center space-x-4 pt-3">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
