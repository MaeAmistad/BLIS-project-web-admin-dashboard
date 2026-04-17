import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import { notifyAllUsers } from "./NotifyAllUsers";

const DispersalManagement = ({ open, onClose, mode, dispersal }) => {
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [raisers, setRaisers] = useState([]);

  const [formData, setFormData] = useState({
    projectName: "",
    raiserId: "",
    dispersalDate: "",
    animalType: "",
    quantity: "",
    status:"Active"
  });

  useEffect(() => {
    if (!open) {
      setFormData({
        projectName: "",
        raiserId: "",
        dispersalDate: "",
        animalType: "",
        quantity: "",
        status:""
      });
    }
  }, [open]);

  useEffect(() => {
    if (mode === "edit" && dispersal) {
      setFormData({
        projectName: dispersal.projectName || "",
        raiserId: dispersal.raiserId || "",
        dispersalDate: dispersal.dispersalDate || "",
        animalType: dispersal.animalType || "",
        quantity: dispersal.quantity || "",
        status: dispersal.status || ""
      });
    }
  }, [dispersal, mode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Projects
        const projectSnap = await getDocs(collection(db, "projects"));
        const projectList = projectSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProjects(projectList);

        // Fetch Raisers
        const raiserSnap = await getDocs(collection(db, "raisers"));
        const raiserList = raiserSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRaisers(raiserList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "quantity") {
      const num = Number(value);
      if (num <= 0) {
        setFormData((prev) => ({ ...prev, quantity: 1 }));
        return;
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user || loading) return;
    if (!user) {
      Swal.fire("Error", "User not authenticated", "error");
      return;
    }

    const quantity = Number(formData.quantity);

    if (!formData.quantity || quantity <= 0) {
      Swal.fire("Invalid Input", "Quantity must be greater than 0", "warning");
      return;
    }

    if (loading) return;
    const result = await Swal.fire({
      title: mode === "edit" ? "Update Dispersal" : "Add Dispersal",
      text:
        mode === "edit"
          ? "Are you sure you want to update this Dispersal?"
          : "Are you sure you want to add this Dispersal?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: mode === "edit" ? "Yes, update it!" : "Yes, add it!",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      if (mode === "add") {
        // ADD
        await addDoc(collection(db, "dispersals"), {
          ...formData,
          quantity: Number(formData.quantity),
          createdAt: serverTimestamp(),
        });

        await notifyAllUsers({
          title: "Dispersal Added",
          message: `A new dispersal was added to: ${formData.projectName}.`,
          type: "add",
        });

        Swal.fire({
          title: "Added!",
          text: "Dispersal has been added successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        onClose();
      } else if (mode === "edit" && dispersal?.id) {
        // UPDATE
        const docRef = doc(db, "dispersals", dispersal.id);

        await updateDoc(docRef, {
          ...formData,
          quantity: Number(formData.quantity),
          updatedAt: serverTimestamp(),
        });

        await notifyAllUsers({
          title: "Dispersal Updated",
          message: `Dispersal ${formData.projectName} was updated.`,
          type: "edit",
        });

        Swal.fire({
          title: "Updated!",
          text: "Dispersal has been updated successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      onClose();
    } catch (error) {
      console.error("Firestore error:", error);
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
      setLoading(false);
    }
  };

  const handleCloseConfirm = async () => {
    const result = await Swal.fire({
      title: "Discard changes?",
      text: "Any unsaved data will be lost.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, close it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
      <button
            onClick={onClose}
            className="absolute top-3 right-3 text-red-500 hover:text-red-800 transition"
          >
            ✕
          </button>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 item-center">
          {mode === "edit" ? "Edit Dispersal" : "Add Dispersal"}
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium">Select Project</label>
            <select
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              className="w-full text-xs border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.projectName}>
                  {project.projectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium">Select Raiser</label>
            <select
              name="raiserId"
  value={formData.raiserId}
              onChange={handleChange}
              className="w-full text-xs border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="">Select Raiser</option>
              {raisers.map((raiser) => {
                const fullName =
                  `${raiser.firstName || ""} ${raiser.middleName || ""} ${raiser.lastName || ""}`.trim();

                return (
                  <option key={raiser.id} value={raiser.id}>
                    {fullName}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium">Animal Type</label>
            <select
              name="animalType"
              value={formData.animalType}
              onChange={handleChange}
              className="w-full border text-xs border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="">Select Animal Type</option>
              <option value="Horse">Horse</option>
              <option value="Cattle">Cattle</option>
              <option value="Swine">Swine</option>
              <option value="Goat">Goat</option>
              <option value="Duck">Duck</option>
              <option value="Chicken">Chicken</option>
              <option value="Ostrich">Ostrich</option>
              <option value="Carabao">Carabao</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium">Quantity</label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border text-xs border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium">
              Date of Dispersal
            </label>
            <input
              type="date"
              name="dispersalDate"
              value={formData.dispersalDate}
              onChange={handleChange}
              className="w-full text-xs border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleCloseConfirm}
            disabled={loading}
            className="px-4 text-xs py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-6 py-2 rounded-xl font-semibold shadow transition
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-xs text-white"
            }`}
          >
            {loading
              ? mode === "edit"
                ? "Updating..."
                : "Adding..."
              : mode === "edit"
                ? "Update Dispersal"
                : "Add Dispersal"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DispersalManagement;
