import React, { useState } from "react";
import Swal from "sweetalert2";

const LivestockHealthListModal = ({ open, onClose , onCancel}) => {
  const [formData, setFormData] = useState({
    livestockName: "",
    breed: "",
    owner: "",
    healthStatus: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Save Button
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Save Record?",
      text: "Do you want to save this health record?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      console.log("Saved Health List Record:", formData);

      await Swal.fire({
        title: "Saved!",
        text: "Livestock health record has been saved successfully.",
        icon: "success",
        confirmButtonColor: "#16a34a",
      });

      onClose();
    }
  };

  // Handle Close Button
  const handleClose = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Unsaved changes will be lost.",
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-green-600">
            Livestock Health Record
          </h2>

          <button
            onClick={onClose}
            className="text-red-500 text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="livestockName"
            value={formData.livestockName}
            onChange={handleChange}
            placeholder="Livestock Name / Tag"
            className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
          <input
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            placeholder="Type / Breed"
            className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
          <input
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            placeholder="Owner / Raiser"
            className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
          />

          <select
            name="healthStatus"
            value={formData.healthStatus}
            onChange={handleChange}
            className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
          >
            <option value="">Select Health Status</option>
            <option value="Healthy">Healthy</option>
            <option value="Sick">Sick</option>
            <option value="Under Treatment">Under Treatment</option>
          </select>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={oncancel}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LivestockHealthListModal;
