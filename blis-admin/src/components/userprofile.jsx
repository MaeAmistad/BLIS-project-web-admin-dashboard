import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  verifyBeforeUpdateEmail,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import Topbar from "../scenes/global/Topbar";
import Sidebarr from "../scenes/global/Sidebar";

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // "email" | "password"

  // Fetch user from Firestore on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            name: data.name || "",
            email: data.email || user.email || "",
            role: data.role || "",
          });
        }
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load profile." });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const startEdit = () => {
    setForm({ ...profile, newEmail: "", newPassword: false });
    setMessage(null);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setMessage(null);
    setCurrentPassword("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleReauth = async () => {
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);
      setShowReauthModal(false);
      setCurrentPassword("");

      if (pendingAction === "email") await sendEmailVerification();
      if (pendingAction === "password") await sendPasswordReset();
    } catch (err) {
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setMessage({ type: "error", text: "Current password is incorrect." });
      } else {
        setMessage({
          type: "error",
          text: err.message || "Re-authentication failed.",
        });
      }
      setShowReauthModal(false);
    }
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!form.name.trim())
      return setMessage({ type: "error", text: "Name is required." });

    try {
      const user = auth.currentUser;
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, { name: form.name, role: form.role });
      setProfile((p) => ({ ...p, name: form.name, role: form.role }));
      setEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update profile." });
    }
  };

  const handleChangeEmail = () => {
    setMessage(null);
    if (
      !form.newEmail.trim() ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.newEmail)
    )
      return setMessage({
        type: "error",
        text: "Enter a valid new email address.",
      });
    if (form.newEmail === profile.email)
      return setMessage({
        type: "error",
        text: "New email must be different from current email.",
      });

    setPendingAction("email");
    setShowReauthModal(true);
  };

  const sendEmailVerification = async () => {
    try {
      const user = auth.currentUser;
      const newEmail = form.newEmail;

      await verifyBeforeUpdateEmail(user, newEmail);

      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, { email: newEmail });

      setMessage({
        type: "success",
        text: `Verification email sent to ${newEmail}. Your email will update once confirmed.`,
      });
      setForm((f) => ({ ...f, newEmail: "" }));
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setMessage({ type: "error", text: "That email is already in use." });
      } else {
        setMessage({
          type: "error",
          text: err.message || "Failed to send verification email.",
        });
      }
    }
  };

  const handleChangePassword = () => {
    setMessage(null);
    setPendingAction("password");
    setShowReauthModal(true);
  };

  const sendPasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      setMessage({
        type: "success",
        text: `Password reset email sent to ${auth.currentUser.email}. Check your inbox.`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Failed to send password reset email.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex bg-gray-50 h-screen overflow-hidden">
        <Sidebarr />
        <div className="flex flex-col flex-1">
          <Topbar />
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 h-screen overflow-hidden">
      <Sidebarr />
      <div className="flex flex-col flex-1">
        <div className="flex-none">
          <Topbar />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
            {/* Avatar & name */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-bold shadow-sm">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-semibold mt-4 text-gray-800">
                {profile.name}
              </h2>
              <p className="text-gray-500">{profile.role}</p>
            </div>

            {/* Global message */}
            {message && (
              <div
                className={`text-sm font-medium mb-4 text-center ${message.type === "error" ? "text-red-600" : "text-green-600"}`}
              >
                {message.text}
              </div>
            )}

            {/* View mode */}
            {!editing ? (
              <div className="space-y-4 text-gray-700">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p>
                    <span className="font-semibold text-gray-800">Name:</span>{" "}
                    {profile.name}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p>
                    <span className="font-semibold text-gray-800">Role:</span>{" "}
                    {profile.role || "—"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p>
                    <span className="font-semibold text-gray-800">Email:</span>{" "}
                    {profile.email}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p>
                    <span className="font-semibold text-gray-800">
                      Password:
                    </span>{" "}
                    ••••••••
                  </p>
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
              <div className="space-y-6">
                <form onSubmit={handleSaveDetails} className="space-y-4">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Profile Details
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
                    >
                      <option value="" disabled>
                        Select a role
                      </option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="MAO">MAO</option>
                      <option value="JO">JO</option>
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-green-800 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      Save Details
                    </button>
                  </div>
                </form>

                <hr />

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Change Email
                  </p>
                  <p className="text-xs text-gray-400">
                    Current: {profile.email}
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Email Address
                    </label>
                    <input
                      name="newEmail"
                      value={form.newEmail}
                      onChange={handleChange}
                      type="email"
                      placeholder="Enter new email"
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleChangeEmail}
                      className="bg-red-700 text-white px-5 py-2 rounded-lg hover:bg-yellow-600 transition text-sm"
                    >
                      Send Verification Email
                    </button>
                  </div>
                </div>

                <hr />

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Change Password
                  </p>
                  <p className="text-xs text-gray-400">
                    A password reset link will be sent to{" "}
                    <strong>{profile.email}</strong>.
                  </p>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleChangePassword}
                      className="bg-red-700 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition text-sm"
                    >
                      Send Password Reset Email
                    </button>
                  </div>
                </div>

                <hr />

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showReauthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm Your Identity
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter your current password to continue.
            </p>
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleReauth}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowReauthModal(false);
                  setCurrentPassword("");
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
