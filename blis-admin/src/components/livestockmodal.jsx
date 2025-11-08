import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const LivestockModal = ({ open, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    farmName: "",
    barangay: "",
    ownerName: "",
    contactNumber: "",
    typeOfRaiser: "",
    livestockName: "",
    typeOfAnimal: "",
    breed: "",
    gender: "",
    ageOrBirthDate: "",
    colorMarkings: "",
    healthCondition: "",
    weight: "",
    status: "",
  });

  const resetForm = () => {
    setFormData({
      farmName: "",
      barangay: "",
      ownerName: "",
      contactNumber: "",
      typeOfRaiser: "",
      livestockName: "",
      typeOfAnimal: "",
      breed: "",
      gender: "",
      ageOrBirthDate: "",
      colorMarkings: "",
      healthCondition: "",
      weight: "",
      status: "",
    });
  };

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else resetForm();
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = Object.entries({
    ownerName: formData.ownerName,
    contactNumber: formData.contactNumber,
    typeOfRaiser: formData.typeOfRaiser,
    livestockName: formData.livestockName,
    typeOfAnimal: formData.typeOfAnimal,
    breed: formData.breed,
    gender: formData.gender,
    status: formData.status,
  }).every(([_, value]) => value.trim() !== "");

  const handleSave = () => {
    if (!isFormValid) return;

    const formattedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const dataWithTimestamps = {
      ...formData,
      createdAt: initialData?.createdAt || formattedDate,
      updatedAt: formattedDate,
    };

    onSave(dataWithTimestamps);
    resetForm();
    onClose();
  };

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "All unsaved changes will be lost.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, close it",
    });

    if (result.isConfirmed) {
      resetForm();
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleCancel();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        open ? "" : "hidden"
      }`}
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="text-center font-bold text-xl border-b p-4">
          {initialData ? "Edit Livestock" : "Add New Livestock"}
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LOCATION DETAILS */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Location Details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Farm Name (if any)
                </label>
                <input
                  type="text"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Barangay / Municipality
                </label>
                <input
                  type="text"
                  name="barangay"
                  value={formData.barangay}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* OWNERSHIP DETAILS */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Ownership Details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Owner’s Full Name
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Type of Raiser
                </label>
                <select
                  name="typeOfRaiser"
                  value={formData.typeOfRaiser}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-2 bg-white focus:ring-2 focus:ring-green-400 focus:outline-none"
                >
                  <option value="" disabled>
                    Select type
                  </option>
                  <option value="Backyard">Backyard</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
            </div>
          </div>

          {/* LIVESTOCK INFORMATION */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-3">
              Livestock Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Livestock Name
                </label>
                <input
                  type="text"
                  name="livestockName"
                  value={formData.livestockName}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Type of Animal (e.g., Swine, Goat)
                </label>
                <input
                  type="text"
                  name="typeOfAnimal"
                  value={formData.typeOfAnimal}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Breed</label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-2 bg-white focus:ring-2 focus:ring-green-400 focus:outline-none"
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Age / Date of Birth
                </label>
                <input
                  type="text"
                  name="ageOrBirthDate"
                  value={formData.ageOrBirthDate}
                  onChange={handleChange}
                  placeholder="e.g., 2 years or Jan 2023"
                  className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Color / Markings
                </label>
                <input
                  type="text"
                  name="colorMarkings"
                  value={formData.colorMarkings}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Health Condition
                </label>
                <input
                  type="text"
                  name="healthCondition"
                  value={formData.healthCondition}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Weight (optional)
                </label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-2 bg-white focus:ring-2 focus:ring-green-400 focus:outline-none"
                >
                  <option value="" disabled>
                    Select status
                  </option>
                  <option value="Active">Active</option>
                  <option value="Sold">Sold</option>
                  <option value="Deceased">Deceased</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 border-t p-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isFormValid}
            className={`px-4 py-2 rounded-xl text-white ${
              isFormValid
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default LivestockModal;
