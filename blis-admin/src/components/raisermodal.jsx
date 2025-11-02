import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const RaiserModal = ({ open, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleInitial: "",
    gender: "",
    contact: "",
    address: "",
    typeOfRaiser: "",
    farmName: "",
    farmLocation: "",
    farmSize: "",
    numberOfWorkers: "",
    registrationStatus: "",
    livestockName: "",
    typeOfAnimal: "",
    breed: "",
    livestockGender: "",
    ageOrBirthDate: "",
    colorMarkings: "",
    healthCondition: "",
    weight: "",
    status: "",
  });

  const resetForm = () => {
    setFormData({
      lastName: "",
      firstName: "",
      middleInitial: "",
      gender: "",
      contact: "",
      address: "",
      typeOfRaiser: "",
      farmName: "",
      farmLocation: "",
      farmSize: "",
      numberOfWorkers: "",
      registrationStatus: "",
      livestockName: "",
      typeOfAnimal: "",
      breed: "",
      livestockGender: "",
      ageOrBirthDate: "",
      colorMarkings: "",
      healthCondition: "",
      weight: "",
      status: "",
    });
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      resetForm();
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = Object.entries({
    lastName: formData.lastName,
    firstName: formData.firstName,
    gender: formData.gender,
    contact: formData.contact,
    address: formData.address,
    typeOfRaiser: formData.typeOfRaiser,
    registrationStatus: formData.registrationStatus,
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
    if (e.target === e.currentTarget) {
      handleCancel();
    }
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
          {initialData ? "Edit Raiser" : "Add New Raiser"}
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PERSONAL INFO */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Personal Information</h2>

            {/* Existing Inputs */}
            <div className="flex flex-wrap gap-3 mb-3">
              <div className="flex-1 min-w-[12rem]">
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              <div className="flex-1 min-w-[12rem]">
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              <div className="w-24">
                <label className="block text-sm font-medium mb-1">M.I.</label>
                <input
                  type="text"
                  name="middleInitial"
                  value={formData.middleInitial}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 bg-white focus:ring-2 focus:ring-green-400 focus:outline-none"
                >
                  <option value="" disabled>Select type</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Contact No.</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Barangay</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type of Raiser</label>
                <select
                  name="typeOfRaiser"
                  value={formData.typeOfRaiser}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 bg-white focus:ring-2 focus:ring-green-400 focus:outline-none mb-10"
                >
                  <option value="" disabled>Select type</option>
                  <option value="Backyard">Backyard</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
            </div>
          </div>

          {/* FARM INFO */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Farm Information</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Farm Name</label>
                <input
                  type="text"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Farm Location</label>
                <input
                  type="text"
                  name="farmLocation"
                  value={formData.farmLocation}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Farm Size</label>
                <input
                  type="text"
                  name="farmSize"
                  value={formData.farmSize}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Number of Workers</label>
                <input
                  type="text"
                  name="numberOfWorkers"
                  value={formData.numberOfWorkers}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Registration Status</label>
                <select
                  name="registrationStatus"
                  value={formData.registrationStatus}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 bg-white focus:ring-2 focus:ring-green-400 focus:outline-none"
                >
                  <option value="" disabled>Select type</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* 🐄 LIVESTOCK INFO */}
          <div className="md:col-span-2 mt-6">
            <h2 className="text-lg font-semibold mb-3 text-center">Livestock Information</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input name="livestockName" value={formData.livestockName} onChange={handleChange} placeholder="Livestock Name" className="border rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none" />
              <input name="typeOfAnimal" value={formData.typeOfAnimal} onChange={handleChange} placeholder="Type of Animal (swine, etc.)" className="border rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none" />
              <input name="breed" value={formData.breed} onChange={handleChange} placeholder="Breed" className="border rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none" />
              <select name="livestockGender" value={formData.livestockGender} onChange={handleChange} className="border rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none">
                <option value="">Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
              <input name="ageOrBirthDate" value={formData.ageOrBirthDate} onChange={handleChange} placeholder="Age / Date of Birth" className="border rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none" />
              <input name="colorMarkings" value={formData.colorMarkings} onChange={handleChange} placeholder="Color / Markings" className="border rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none" />
              <input name="healthCondition" value={formData.healthCondition} onChange={handleChange} placeholder="Health Condition" className="border rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none" />
              <input name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight (optional)" className="border rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none" />
              <select name="status" value={formData.status} onChange={handleChange} className="border rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none">
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Sold">Sold</option>
                <option value="Deceased">Deceased</option>
              </select>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 border-t p-4">
          <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">Cancel</button>
          <button
            onClick={handleSave}
            disabled={!isFormValid}
            className={`px-4 py-2 rounded-lg text-white ${
              isFormValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default RaiserModal;
