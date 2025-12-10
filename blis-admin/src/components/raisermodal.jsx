import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const defaultForm = {
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
};

const RaiserModal = ({ open, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(defaultForm);

  // Reset form for new entry OR load fields for edit
  useEffect(() => {
    if (open) {
      setFormData(initialData || defaultForm);
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save and proceed to STEP 2 (Livestock)
  const handleNext = () => {
    const now = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const data = {
      ...formData,
      createdAt: initialData?.createdAt || now,
      updatedAt: now,
    };

    onSave(data);
  };

  const handleCancel = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Unsaved changes will be lost.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, close it",
    });

    if (confirm.isConfirmed) {
      onClose();
    }
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) handleCancel();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={handleBackdrop}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="text-center font-bold text-xl border-b p-4">
          {initialData ? "Edit Raiser" : "Add New Raiser"}
        </div>

        {/* FORM CONTENT */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* PERSONAL INFORMATION */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Personal Information</h2>

            {/* Name Fields */}
            <div className="flex flex-wrap gap-3 mb-3">
              <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
              <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
              <Input label="M.I." name="middleInitial" value={formData.middleInitial} onChange={handleChange} small />
            </div>

            <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={["Male", "Female"]} />
            <Input label="Contact No." name="contact" value={formData.contact} onChange={handleChange} />
            <Input label="Barangay" name="address" value={formData.address} onChange={handleChange} />

            <Select
              label="Type of Raiser"
              name="typeOfRaiser"
              value={formData.typeOfRaiser}
              onChange={handleChange}
              options={["Backyard", "Commercial"]}
            />
          </div>

          {/* FARM INFORMATION */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Farm Information</h2>

            <Input label="Farm Name" name="farmName" value={formData.farmName} onChange={handleChange} />
            <Input label="Farm Location" name="farmLocation" value={formData.farmLocation} onChange={handleChange} />
            <Input label="Farm Size" name="farmSize" value={formData.farmSize} onChange={handleChange} />
            <Input label="Number of Workers" name="numberOfWorkers" value={formData.numberOfWorkers} onChange={handleChange} />

            <Select
              label="Registration Status"
              name="registrationStatus"
              value={formData.registrationStatus}
              onChange={handleChange}
              options={["Active", "Inactive"]}
            />
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex justify-end gap-3 border-t p-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RaiserModal;

/* --------------------------
   REUSABLE INPUT COMPONENTS
--------------------------- */

const Input = ({ label, name, value, onChange, small }) => (
  <div className={small ? "w-24" : "flex-1 min-w-[12rem]"}>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
    />
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div className="mt-3">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-xl p-2 bg-white focus:ring-2 focus:ring-green-400 focus:outline-none"
    >
      <option value="" disabled>
        Select {label}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);
