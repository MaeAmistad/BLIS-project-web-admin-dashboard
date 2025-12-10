import { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDocs, collection, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Swal from "sweetalert2";
import Header from "../../components/header";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'; 
import EditRoundedIcon from '@mui/icons-material/EditRounded';


const Account = () => {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ id: "", role: "", name: "", email: "", password: "" });

  const Rows = ["Role", "Name", "Email", "Password", "Actions"];

  // Fetch users
  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setUsers(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

// Add new user
const saveData = async () => {
  if (!name || !email || !password || !role) {
    Swal.fire({
      icon: "warning",
      title: "Missing Fields",
      text: "Please fill in all fields before adding a user.",
      confirmButtonColor: "#4CAF50",
    });
    return;
  }

  try {
    const auth = getAuth();

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, "users", uid), {
      role,
      name,
      email,
      password,
      uid,
      createdAt: new Date(),
    });

    // Clear inputs
    setRole("");
    setName("");
    setEmail("");
    setPassword("");

    Swal.fire({
      icon: "success",
      title: "User Account Created!",
      text: "The new user has been added successfully.",
      confirmButtonColor: "#4CAF50",
      timer: 2000,
      showConfirmButton: false,
    });

    // Refresh users
    fetchData();

  } catch (error) {
    console.error("Error adding user:", error);
    Swal.fire({
      icon: "error",
      title: "Error Creating Account",
      text: error.message,
      confirmButtonColor: "#d33",
    });
  }
};



  // Delete user
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteDoc(doc(db, "users", id));
      fetchData();
    }
  };

  // Open edit modal
  const openEditModal = (user) => {
    setEditData(user);
    setEditModalOpen(true);
  };

  // Save edits
  const handleEditSave = async () => {
    const { id, role, name, email, password } = editData;

    if (!name || !email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Details",
        text: "Please fill out all fields before saving changes.",
        confirmButtonColor: "#4CAF50",
      });
      return;
    }

    try {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, { role, name, email, password });

      setEditModalOpen(false);

      Swal.fire({
        icon: "success",
        title: "Changes Saved!",
        text: "User information has been updated successfully.",
        confirmButtonColor: "#4CAF50",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchData();
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update user details.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebarr />
      <div className="flex-1">
        <Topbar />
        <div className="flex justify-between items-center">
          <Header title="User Account" />
        </div>

        <div className="bg-white p-5 m-5 rounded-lg shadow-md flex flex-col lg:flex-row gap-5">
          {/* TABLE SECTION */}
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden text-sm">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  {Rows.map((header, index) => (
                    <th key={index} className="p-3 font-semibold text-center">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-green-50 text-center">
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.password}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md transition"
                      >
                        <EditRoundedIcon/>
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition"
                      >
                        <DeleteRoundedIcon/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FORM SECTION */}
          <div className="w-full lg:w-1/4 border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
            <h4 className="font-bold text-xl text-center mb-2">ADD ACCOUNT</h4>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value.toUpperCase())}
                  className="w-full h-8 border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-8 border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-8 border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-8 border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="text-center mt-4">
                <button
                  onClick={saveData}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 mt-3 rounded-xl transition font-semibold"
                >
                  ADD
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* EDIT MODAL */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6">
              <h2 className="text-lg font-bold mb-4"> Edit User</h2>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Role"
                  value={editData.role}
                  onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                  className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="Name"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={editData.password}
                  onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                  className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex justify-end gap-2 mt-5">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
