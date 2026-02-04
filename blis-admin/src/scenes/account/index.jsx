import { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase";
import Swal from "sweetalert2";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import {
  CancelRounded,
  DeleteRounded,
  EditRounded,
  SaveAltRounded,
  VisibilityOffRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Headerr from "../../components/Headerr";
import { notifyAllUsers } from "../../components/NotifyAllUsers";

const Account = () => {
  const [users, setUsers] = useState([]);
  const [mode, setMode] = useState("add");
  const [data, setData] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserFilter, setSelectedUserFilter] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const role = [
    { key: "1", value: "ADMIN" },
    { key: "2", value: "MAO" },
    { key: "3", value: "JO" },
  ];

  // Fetch users
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(data);
    };

    fetchData();
  }, []);

  const handleInput = (e, transform) => {
    const { name, value } = e.target;

    if (name === "password") {
      setPasswordError("");
    }

    setData((prev) => ({
      ...prev,
      [name]: transform ? transform(value) : value,
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value !== "" ? value : prevData[name], // Keep old value if not changed
    }));
  };

  // Handle dropdown selection
  const handleUserFilterChange = (event) => {
    setSelectedUserFilter(event.target.value);
  };

  // Filtered users list based on selection
  const filteredUsers = users.filter((user) => {
    // Always require ACTIVE status
    if (user.status?.toUpperCase() !== "ACTIVE") return false;

    // If no dropdown selection, show all ACTIVE users
    if (!selectedUserFilter) return true;

    // If dropdown selected, match the user
    return user.name === selectedUserFilter;
  });

  // Add/Edit new user
  const handleSubmit = async (event) => {
    event.preventDefault();

    const { role, name, email, password } = data;

    setPasswordError("");

    if (!role || !name || !email || (mode === "add" && !password)) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required fields.",
        confirmButtonColor: "#106013ff",
      });
      return;
    }

    // 🔴 Password length validation
    if (mode === "add" && password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return; // ❌ Stop submission
    }

    if (mode === "add") {
      if (data.password.length < 8) {
        setPasswordError("Password must be at least 8 characters.");
        return;
      }

      if (data.password !== confirmPassword) {
        setPasswordError("Passwords do not match.");
        return;
      }
    }

    try {
      const auth = getAuth();

      if (mode === "add") {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        const user = userCredential.user;
        const uid = user.uid;

        // 🔹 Save user to Firestore
        await setDoc(doc(db, "users", uid), {
          uid,
          role,
          name,
          email,
          status: "ACTIVE",
          createdAt: serverTimestamp(),
        });

        // 🔹 Send verification email
        await sendEmailVerification(user);

        await notifyAllUsers({
          title: "User Added",
          message: `A new user account was created: ${data.role} ${data.name}.`,
          type: "add",
        });

        // 🔹 Notify admin
        Swal.fire({
          icon: "success",
          title: "User Account Created",
          html: `
            <p>The user account has been created successfully.</p>
            <p class="mt-2 text-sm text-gray-600">
              A verification email has been sent to <b>${email}</b>.
            </p>
          `,
          confirmButtonColor: "#106013ff",
          confirmButtonText: "Ok",
        });
      }

      if (mode === "edit" && selectedUser) {
        await updateDoc(doc(db, "users", selectedUser.id), {
          role,
          name,
          email,
          updatedAt: serverTimestamp(),
        });

        await notifyAllUsers({
          title: "User Information Updated",
          message: `Information for user ${data.email} has been updated.`,
          type: "add",
        });

        Swal.fire({
          icon: "success",
          title: "User Updated!",
          text: "The user information has been updated.",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      // Reset form
      setMode("add");
      setSelectedUser(null);
      setData({
        role: "",
        name: "",
        email: "",
        password: "",
      });

      // Refresh users
      const querySnapshot = await getDocs(collection(db, "users"));
      setUsers(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
      //window.location.reload();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text: error.message,
        confirmButtonColor: "#d33",
      });
    }
  };

  // Delete user
  const handleDelete = async (user) => {
    const confirm = await Swal.fire({
      title: "Deactivate User?",
      text: `Are you sure you want to deactivate ${user.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, deactivate",
    });

    if (!confirm.isConfirmed) return;

    try {
      await updateDoc(doc(db, "users", user.id), {
        status: "inactive",
        updatedAt: serverTimestamp(),
      });

      await notifyAllUsers({
        title: "Inventory Updated",
        message: `User account ${data.email} was deactivated.`,
        type: "delete",
      });

      Swal.fire({
        icon: "success",
        title: "User Deactivated",
        text: "User has been set to inactive.",
        timer: 1500,
        showConfirmButton: false,
      });

      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: "inactive" } : u)),
      );
      window.location.reload();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Action Failed",
        text: error.message,
      });
    }
  };

  // function for edit
  const handleEditClick = (user) => {
    setMode("edit");
    setSelectedUser(user);
    setData({
      role: user.role,
      name: user.name,
      email: user.email,
      password: "",
    });
  };

  // function for cancel edit
  const handleCancel = () => {
    setMode("add");
    setSelectedUser(null);
    setData({ name: "", remarks: "" });
  };

  const handleResetPassword = async () => {
    try {
      const auth = getAuth();

      await sendPasswordResetEmail(auth, data.email);

      Swal.fire({
        icon: "success",
        title: "Password Reset Email Sent",
        text: `A password reset link was sent to ${data.email}.`,
        confirmButtonText: "Ok",
        confirmButtonColor: "##2E7D32",
      });
      window.location.reload();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text: error.message,
        confirmButtonText: "Close",
      });
    }
  };

  return (
    <div className="app flex flex-col md:flex-row">
      <Sidebarr />
      <div className="content flex-grow p-2 overflow-auto h-screen">
        <Topbar />

        <div className="flex flex-col md:flex-row justify-between p-1 m-2 sticky top-14">
          <Headerr title="User Account" />
        </div>

        <div className="m-1 mt-1 flex-grow overflow-y-auto bg-white shadow-md rounded-md">
          {/* Search Filter */}
          <div className="p-1">
            <div className="h-10">
              <div className="flex my-1 mx-1 space-x-1">
                <select
                  className="w-full sm:max-w-xs border border-green-600 focus:ring-2 focus:ring-green-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-gray-700 placeholder-gray-400"
                  value={selectedUserFilter}
                  onChange={handleUserFilterChange}
                >
                  <option value="">User Name</option>

                  {users
                    ?.filter((user) => user.status?.toUpperCase() === "ACTIVE")
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="flex flex-row space-x-5 mt-3 mx-2.5">
            <div className="relative overflow-y-auto h-[500px] border w-full border-gray-300 rounded-md scroll-smooth">
              <table className="min-w-[400px] w-full text-center">
                <thead className="h-8 bg-primary uppercase sticky top-0 text-white text-xs z-10">
                  <tr>
                    <th>No</th>
                    <th>Role</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-4 text-gray-500 text-center text-xs"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <tr
                        key={user.id}
                        className="border-b hover:bg-green-50 text-center text-xs"
                      >
                        <td className="p-2 text-center border border-gray-400">
                          {index + 1}
                        </td>
                        <td className="p-2 text-center border border-gray-400">
                          {user.role}
                        </td>
                        <td className="p-2 text-center border border-gray-400">
                          {user.name}
                        </td>
                        <td className="p-2 text-center border border-gray-400">
                          {user.email}
                        </td>
                        <td className="p-2 text-center border border-gray-400">
                          <div className="flex justify-center space-x-1">
                            <IconButton
                              aria-label="edit"
                              onClick={() => handleEditClick(user)}
                            >
                              <EditRounded
                                sx={{ color: "#266b0f", fontSize: 16 }}
                              />
                            </IconButton>
                            <IconButton
                              aria-label="edit"
                              onClick={() => handleDelete(user)}
                            >
                              <DeleteRounded
                                sx={{ color: "#a30808", fontSize: 16 }}
                              />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* FORM SECTION */}
            <div className="bg-white rounded-xl border border-current w-96 p-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center p-2 bg-gray-100 rounded-xl">
                  <p className="font-bold text-center">
                    {mode === "add" ? "Add User" : "Edit User"}
                  </p>
                </div>

                {/* USER INFORMATION SECTION */}
                <div className="mt-1 p-1">
                  <div className="mt-1">
                    <p className="text-sm">Role</p>
                    <select
                      className="w-full h-10 rounded-lg p-1 border border-current"
                      name="role"
                      value={data.role}
                      onChange={handleSelectChange}
                    >
                      <option value=""> </option>
                      {role.map((stat) => (
                        <option key={stat.key} value={stat.value}>
                          {stat.value}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-1">
                    <p className="text-sm">Name</p>
                    <input
                      type="text"
                      className="w-full h-10 border border-current p-1 text-xs rounded-xl"
                      name="name"
                      value={data.name}
                      onChange={handleInput}
                    />
                  </div>

                  <div className="mt-1">
                    <p className="text-sm">Email</p>
                    <input
                      type="text"
                      className="w-full h-10 border border-current p-1 text-xs rounded-xl"
                      name="email"
                      value={data.email}
                      onChange={handleInput}
                    />
                  </div>

                  {mode === "add" && (
                    <>
                      <div className="mt-1 relative">
                        <p className="text-sm">Password</p>
                        <input
                          type={isOpen ? "text" : "password"}
                          name="password"
                          value={data.password}
                          onChange={handleInput}
                          className={`w-full h-10 border p-1 text-xs rounded-xl
          ${passwordError ? "border-red-500" : "border-current"}
        `}
                        />

                        <button
                          type="button"
                          onClick={() => setIsOpen((prev) => !prev)}
                          className="absolute right-3 pt-5 top-1/2 -translate-y-1/2"
                        >
                          {isOpen ? (
                            <VisibilityRounded
                              sx={{ color: "#959595", fontSize: 14 }}
                            />
                          ) : (
                            <VisibilityOffRounded
                              sx={{ color: "#959595", fontSize: 14 }}
                            />
                          )}
                        </button>
                      </div>

                      <div className="mt-1 relative">
                        <p className="text-sm">Confirm Password</p>
                        <input
                          type={isOpen ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`w-full h-10 border p-1 text-xs rounded-xl
          ${passwordError ? "border-red-500" : "border-current"}
        `}
                        />

                        <button
                          type="button"
                          onClick={() => setIsOpen((prev) => !prev)}
                          className="absolute right-3 pt-5 top-1/2 -translate-y-1/2"
                        >
                          {isOpen ? (
                            <VisibilityRounded
                              sx={{ color: "#959595", fontSize: 14 }}
                            />
                          ) : (
                            <VisibilityOffRounded
                              sx={{ color: "#959595", fontSize: 14 }}
                            />
                          )}
                        </button>
                      </div>

                      {passwordError && (
                        <p className="text-red-500 text-xs mt-1">
                          {passwordError}
                        </p>
                      )}
                    </>
                  )}

                  {mode === "edit" && (
                    <div className="mt-3 flex justify-center">
                      <button
                        type="button"
                        onClick={handleResetPassword}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-xl text-xs hover:bg-yellow-600"
                      >
                        Send Password Reset Email
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-center items-center m-2">
                  <button
                    type="submit"
                    className="bg-primary w-28 h-10 rounded-3xl text-white text-xs my-3 cursor-pointer hover:bg-lighter-blue m-1 flex items-center justify-center"
                  >
                    <SaveAltRounded className="mr-1" />
                    {mode === "add" ? "Add" : "Update"}
                  </button>

                  {mode === "edit" && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-300 w-28 h-10 rounded-3xl text-xs text-black my-3 cursor-pointer hover:bg-lighter-blue m-1 flex items-center justify-center"
                    >
                      <CancelRounded className="mr-1 text-black" />
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
