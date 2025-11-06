import React, { useState } from "react";
import Swal from "sweetalert2";

const VaccinationRecordModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    livestockName: "",
    vaccineName: "",
    dateOfVaccination: "",
    administeredBy: "",
    dosage: "",
    remarks: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // SAVE BUTTON WITH CONFIRMATION
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Save Vaccination Record?",
      text: "Do you want to save this vaccination record?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a", // Tailwind green-600
      cancelButtonColor: "#6b7280", // Tailwind gray-500
    });

    if (result.isConfirmed) {
      console.log("Saved Vaccination Record:", formData);

      await Swal.fire({
        title: "Saved!",
        text: "Vaccination record has been saved successfully.",
        icon: "success",
        confirmButtonColor: "#16a34a",
      });

      onClose();
    }
  };

  // CLOSE BUTTON WITH CONFIRMATION
  const handleClose = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Unsaved changes will be lost.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, close it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626", // Tailwind red-600
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          Vaccination Record
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="livestockName"
            value={formData.livestockName}
            onChange={handleChange}
            placeholder="Livestock Name / Tag Number"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            name="vaccineName"
            value={formData.vaccineName}
            onChange={handleChange}
            placeholder="Vaccine Name"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            type="date"
            name="dateOfVaccination"
            value={formData.dateOfVaccination}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            name="administeredBy"
            value={formData.administeredBy}
            onChange={handleChange}
            placeholder="Administered By"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            placeholder="Dosage"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Remarks"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VaccinationRecordModal;
