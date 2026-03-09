import React, { useState } from "react";
import Swal from "sweetalert2";

const TreatmentRecordModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    livestockTag: "",
    illnessType: "",
    medication: "",
    dateStarted: "",
    dateCompleted: "",
    administeredBy: "",
    dosage: "",
    result: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

 
    const confirm = await Swal.fire({
      title: "Save Treatment Record?",
      text: "Please confirm to save this record.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
    });

    if (confirm.isConfirmed) {
      console.log("Saved Treatment Record:", formData);

 
      await Swal.fire({
        icon: "success",
        title: "Record Saved",
        text: "The treatment record has been saved successfully!",
        confirmButtonColor: "#16a34a",
      });

 
      setFormData({
        livestockTag: "",
        illnessType: "",
        medication: "",
        dateStarted: "",
        dateCompleted: "",
        administeredBy: "",
        dosage: "",
        result: "",
      });

      onClose();
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600">
          Treatment Record
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="livestockTag"
            value={formData.livestockTag}
            onChange={handleChange}
            placeholder="Livestock Name / Tag Number"
            className="w-full border rounded-xl p-2"
          />
          <input
            name="illnessType"
            value={formData.illnessType}
            onChange={handleChange}
            placeholder="Type of Illness"
            className="w-full border rounded-xl p-2"
          />
          <input
            name="medication"
            value={formData.medication}
            onChange={handleChange}
            placeholder="Medication"
            className="w-full border rounded-xl p-2"
          />
          <input
            type="date"
            name="dateStarted"
            value={formData.dateStarted}
            onChange={handleChange}
            className="w-full border rounded-xl p-2"
          />
          <input
            type="date"
            name="dateCompleted"
            value={formData.dateCompleted}
            onChange={handleChange}
            className="w-full border rounded-xl p-2"
          />
          <input
            name="administeredBy"
            value={formData.administeredBy}
            onChange={handleChange}
            placeholder="Administered By"
            className="w-full border rounded-xl p-2"
          />
          <input
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            placeholder="Dosage / Frequency"
            className="w-full border rounded-xl p-2"
          />
          <input
            name="result"
            value={formData.result}
            onChange={handleChange}
            placeholder="Result"
            className="w-full border rounded-xl p-2"
          />

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={handleCloseConfirm}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TreatmentRecordModal;
