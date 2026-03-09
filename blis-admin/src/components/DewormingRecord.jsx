import React, { useState } from "react";
import Swal from "sweetalert2";

const DewormingRecordModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    livestockName: "",
    typeOfDewormer: "",
    dateAdministered: "",
    nextSchedule: "",
    administeredBy: "",
    dosage: "",
    remarks: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    const confirm = await Swal.fire({
      title: "Save Deworming Record?",
      text: "Please confirm to save this deworming record.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
    });

    if (confirm.isConfirmed) {
      console.log("Saved Deworming Record:", formData);

      await Swal.fire({
        icon: "success",
        title: "Record Saved",
        text: "Deworming record has been saved successfully!",
        confirmButtonColor: "#16a34a",
      });

      setFormData({
        livestockName: "",
        typeOfDewormer: "",
        dateAdministered: "",
        nextSchedule: "",
        administeredBy: "",
        dosage: "",
        remarks: "",
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
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          Deworming Record
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="livestockName"
            value={formData.livestockName}
            onChange={handleChange}
            placeholder="Livestock Name / Tag Number"
            className="w-full border rounded-xl p-2"
          />
          <input
            name="typeOfDewormer"
            value={formData.typeOfDewormer}
            onChange={handleChange}
            placeholder="Type of Dewormer"
            className="w-full border rounded-xl p-2"
          />
          <input
            type="date"
            name="dateAdministered"
            value={formData.dateAdministered}
            onChange={handleChange}
            className="w-full border rounded-xl p-2"
          />
          <input
            type="date"
            name="nextSchedule"
            value={formData.nextSchedule}
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
            placeholder="Dosage"
            className="w-full border rounded-xl p-2"
          />
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Remarks"
            className="w-full border rounded-xl p-2 h-20"
          />

        
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

export default DewormingRecordModal;
