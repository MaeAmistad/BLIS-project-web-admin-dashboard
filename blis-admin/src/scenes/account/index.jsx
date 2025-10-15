import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Header from "../../components/header";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";

const Account = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ id: "", name: "", email: "", password: "" });

  const Rows = ["No.", "Name", "Email", "Password", "Actions"];

  // ✅ Validation before adding
    const saveData = async () => {
    if (!name || !email || !password) {
        Swal.fire({
          icon: "warning",
          title: "Missing Fields",
          text: "Please fill in all fields before adding a user.",
          confirmButtonColor: "#4CAF50",
        });
        return;
    }

    try {
        const docRef = doc(collection(db, "users"));
        await setDoc(docRef, { name, email, password });

        // ✅ Clear input fields
        setName("");
        setEmail("");
        setPassword("");

        // ✅ Show success modal
        Swal.fire({
          icon: "success",
          title: "User Added!",
          text: "The new user has been added successfully.",
          confirmButtonColor: "#4CAF50",
          timer: 2000,
          showConfirmButton: false,
        });

        // ✅ Refresh table data
        fetchData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was a problem adding the user.",
        confirmButtonColor: "#d33",
      });
        console.error("Error adding user:", error);
    }
    };


  // ✅ Fetch users
  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Delete user
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteDoc(doc(db, "users", id));
      fetchData();
    }
  };

  // ✅ Open edit modal
  const openEditModal = (user) => {
    setEditData(user);
    setEditModalOpen(true);
  };

  // ✅ Save edits
  const handleEditSave = async () => {
    const { id, name, email, password } = editData;
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
      await updateDoc(userRef, { name, email, password });
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

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update user details.",
        confirmButtonColor: "#d33",
      });

      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="flex bg-[#F5F5F5]">
      <Sidebarr />
      <div className="w-full">
        <Topbar />
        <div className="flex justify-between items-center">
          <Header title="User Account" />
        </div>

        <div className="bg-white p-4 m-5 rounded-lg shadow-md flex gap-3">
          {/* ✅ TABLE SECTION */}
          <div className="w-3/4 overflow-auto">
            <table className="table-auto w-full border-collapse rounded-lg overflow-hidden">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  {Rows.map((header, index) => (
                    <th
                      key={index}
                      className="p-3 text-sm font-semibold tracking-wide text-center"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-green-50 text-center transition-all"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.password}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={() => openEditModal(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ FORM SECTION */}
          <div className="w-1/4 border border-gray-200 rounded-lg p-4 shadow-sm">
           <form 
            autoComplete="off" 
            onSubmit={(e) => e.preventDefault()} 
            id="add-account-form"
            >
            <h4 className="font-bold text-xl text-center mb-4">ADD ACCOUNT</h4>

            <input 
                type="text" 
                name="fakeusernameremembered" 
                style={{ display: "none" }} 
            />
            <input 
                type="password" 
                name="fakepasswordremembered" 
                style={{ display: "none" }} 
            />

            <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
                autoComplete="off"
                name="username"
            />

            <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                autoComplete="new-email"
                name="new-email"
            />

            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                autoComplete="new-password"
                name="new-password"
            />

            <div className="text-center mt-6">
                <Button
                variant="contained"
                sx={{
                    backgroundColor: "#4CAF50",
                    px: 5,
                    "&:hover": { backgroundColor: "#45a049" },
                }}
                onClick={saveData}
                >
                ADD
                </Button>
            </div>
            </form>
          </div>
        </div>

        {/* ✅ SUCCESS MODAL */}
        <Modal
          open={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          aria-labelledby="success-modal"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              textAlign: "center",
              width: 300,
            }}
          >
            <Typography variant="h6">✅ User Created Successfully!</Typography>
            <Typography sx={{ mt: 2 }}>
              The new user has been added to the system.
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 3, backgroundColor: "#4CAF50" }}
              onClick={() => setSuccessModalOpen(false)}
            >
              OK
            </Button>
          </Box>
        </Modal>

        {/* ✅ EDIT MODAL */}
        <Modal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          aria-labelledby="edit-modal"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              width: 400,
            }}
          >
            <Typography variant="h6" gutterBottom>
              ✏️ Edit User
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Name"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
              <TextField
                label="Email"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
              />
              <TextField
                label="Password"
                type="password"
                value={editData.password}
                onChange={(e) =>
                  setEditData({ ...editData, password: e.target.value })
                }
              />
            </Stack>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 1 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleEditSave}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Account;
