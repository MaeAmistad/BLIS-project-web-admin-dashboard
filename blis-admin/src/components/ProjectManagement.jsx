import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import { notifyAllUsers } from "./NotifyAllUsers";

const ProjectManagement = ({ open, onClose, mode, project }) => {
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
    targetBeneficiaries: "",
    animalType: "",
    budget: "",
  });

  useEffect(() => {
    if (!open) {
      setFormData({
        projectName: "",
        description: "",
        startDate: "",
        endDate: "",
        targetBeneficiaries: "",
        animalType: "",
        budget: "",
      });
    }
  }, [open]);

  useEffect(() => {
    if (mode === "edit" && project) {
      setFormData({
        projectName: project.projectName || "",
        description: project.description || "",
        startDate: project.startDate || "",
        endDate: project.endDate || "",
        targetBeneficiaries: project.targetBeneficiaries || "",
        animalType: project.animalType || "",
        budget: project.budget || "",
      });
    }
  }, [project, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "budget") {
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

    const budget = Number(formData.budget);

    if (!formData.budget || budget <= 0) {
      Swal.fire("Invalid Input", "Budget must be greater than 0", "warning");
      return;
    }

    if (loading) return;
    const result = await Swal.fire({
      title: mode === "edit" ? "Update Project" : "Add Project",
      text:
        mode === "edit"
          ? "Are you sure you want to update this project?"
          : "Are you sure you want to add this project?",
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
        await addDoc(collection(db, "projects"), {
          ...formData,
          budget: Number(formData.budget),
          createdAt: serverTimestamp(),
        });

        await notifyAllUsers({
          title: "Project Added",
          message: `A new project was added: ${formData.projectName}.`,
          type: "add",
        });

        Swal.fire({
          title: "Added!",
          text: "Project has been added successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        onClose();
      } else if (mode === "edit" && project?.id) {
        // UPDATE
        const docRef = doc(db, "projects", project.id);

        await updateDoc(docRef, {
          ...formData,
          budget: Number(formData.budget),
          updatedAt: serverTimestamp(),
        });

        await notifyAllUsers({
          title: "Project Updated",
          message: `Project ${formData.projectName} was updated.`,
          type: "edit",
        });

        Swal.fire({
          title: "Updated!",
          text: "Project has been updated successfully.",
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
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 item-center">
        {mode === "edit" ? "Edit Project" : "Add Project"}
      </h2>


      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium">Project Name</label>
          <input
            type="text"
            name="projectName"
            value={formData.itemName}
            onChange={handleChange}
            className="w-full text-xs border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full text-xs border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full text-xs border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full text-xs border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium">Target Beneficiaries</label>
          <input
            type="text"
            name="targetBeneficiaries"
            value={formData.targetBeneficiaries}
            onChange={handleChange}
            className="w-full text-xs border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
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
          <label className="block text-xs font-medium">Budget (Optional)</label>
          <input
            type="number"
            name="budget"
            min="1"
            value={formData.budget}
            onChange={handleChange}
            className="w-full border text-xs border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
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
            ? "Update Project"
            : "Add Project"}
        </button>
      </div>
    </div>
  </div>
);
};

export default ProjectManagement;
