import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../components/AuthContext";

const defaultForm = {
  address: "",
  contactNumber: "",
  email: "",
  farmLocation: "",
  farmSize: "",
  farmName: "",
  gender: "",
  lastName: "",
  firstName: "",
  middleInitial: "",
  numberOfWorkers: "",
  registrationStatus: "",
  dateOfRegistration: "",
  typeOfRaiser: "",
  farmSizeUnit: "hectare",
  farmSizeInHectares: "",
};

const validators = {
  lettersOnly: /^[a-zA-Z\s]*$/, // allows spaces
  numbersOnly: /^[0-9]*$/,
};

const barangayOptions = [
  "Aggay",
  "An-annam",
  "Balaleng",
  "Banaoang",
  "Bulag",
  "Buquig",
  "Cabalanggan",
  "Cabaroan",
  "Cabusligan",
  "Capangdanan",
  "Guimod",
  "Lingsat",
  "Malingeb",
  "Mira",
  "Naguiddayan",
  "Ora",
  "Paing",
  "Puspus",
  "Quimmarayan",
  "Sagneb",
  "Sagpat",
  "San Mariano",
  "San Isidro",
  "San Julian",
  "Sinabaan",
  "Taguiporo",
  "Taleb",
  "Tay-ac",
  "Barangay 1 (Poblacion)",
  "Barangay 2 (Poblacion)",
  "Barangay 3 (Poblacion)",
  "Barangay 4 (Poblacion)",
  "Barangay 5 (Poblacion)",
  "Barangay 6 (Poblacion)",
];

const RaiserModal = ({ open, onClose, onCancel, onSave, initialData }) => {
  const [formData, setFormData] = useState(defaultForm);

  const { user } = useAuth();

  useEffect(() => {
    if (open && Object.keys(initialData || {}).length > 0) {
      setFormData({
        ...initialData,
        farmSize: initialData.farmSize?.toString() || "",
        farmSizeUnit: "hectare",
        farmSizeInHectares: initialData.farmSize || "",
      });
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Letters only fields
    const lettersOnlyFields = [
      "lastName",
      "firstName",
      "middleInitial",
      "farmName",
      "farmLocation",
    ];

    if (lettersOnlyFields.includes(name)) {
      if (!validators.lettersOnly.test(value)) return;
    }

    // Contact number: numbers only, max 11 digits
    if (name === "contactNumber") {
      if (!validators.numbersOnly.test(value)) return;
      if (value.length > 11) return;
    }

    // Number of workers: numbers only
    if (name === "numberOfWorkers") {
      if (!validators.numbersOnly.test(value)) return;
    }

    if (name === "farmSize") {
      const converted = convertToHectares(value, formData.farmSizeUnit);

      setFormData((prev) => ({
        ...prev,
        farmSize: value,
        farmSizeInHectares: converted,
      }));
    } else if (name === "farmSizeUnit") {
      const converted = convertToHectares(formData.farmSize, value);

      setFormData((prev) => ({
        ...prev,
        farmSizeUnit: value,
        farmSizeInHectares: converted,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    if (!formData.lastName || !formData.firstName) {
      Swal.fire({
        title: "Missing Info",
        text: "Please complete required fields.",
        icon: "warning",
      });

      return false;
    }

    if (!formData.gender || !formData.typeOfRaiser) {
      Swal.fire({
        title: "Missing Info",
        text: "Please complete required fields.",
        icon: "warning",
      });

      return false;
    }

    return true;
  };

  // Save and proceed to STEP 2 (Livestock)
  const handleNext = () => {
    if (!validateForm()) return;

    //const now = new Date().toISOString();

    onSave({
      ...formData,
      farmSize: formData.farmSizeInHectares || formData.farmSize,
    });
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
      onCancel();
    }
  };

  const convertToHectares = (value, unit) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "";

    switch (unit) {
      case "sqm":
      case "m":
        return num / 10000;
      case "hectare":
      default:
        return num;
    }
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) handleCancel();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdrop}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto
                 bg-white rounded-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Add New Raiser
            </h1>
            <p className="text-sm text-gray-500">
              Fill in personal and farm information
            </p>
          </div>

          <button onClick={onClose} className="text-red-500 text-xl">
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">
          {/* ROW 1 — PERSONAL INFO */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
              />
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleChange}
              />
              <Input
                label="Middle Name"
                name="middleInitial"
                value={formData.middleInitial || ""}
                onChange={handleChange}
              />

              <Input
                label="Email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
              />

              <Select
                label="Gender"
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                options={["Male", "Female"]}
              />
              <Input
                label="Contact No."
                name="contactNumber"
                value={formData.contactNumber || ""}
                onChange={handleChange}
              />
              <Select
                label="Barangay"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                options={barangayOptions}
              />

              <Select
                label="Type of Raiser"
                name="typeOfRaiser"
                value={formData.typeOfRaiser || ""}
                onChange={handleChange}
                options={["Backyard", "Commercial"]}
              />
            </div>
          </div>

          {/* ROW 2 — FARM INFO */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
              Farm Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Farm Name"
                name="farmName"
                value={formData.farmName || ""}
                onChange={handleChange}
              />
              <Input
                label="Farm Location"
                name="farmLocation"
                value={formData.farmLocation || ""}
                onChange={handleChange}
              />
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <Input
                    label="Farm Size"
                    type="number"
                    name="farmSize"
                    value={formData.farmSize || ""}
                    onChange={handleChange}
                  />

                  <select
                    name="farmSizeUnit"
                    value={formData.farmSizeUnit}
                    onChange={handleChange}
                    className="w-40 border h-9 mt-5 rounded-xl text-xs p-2 bg-white focus:ring-2 focus:ring-green-400 focus:outline-none"
                  >
                    <option value="hectare">ha</option>
                    <option value="sqm">sqm</option>
                  </select>
                </div>

                {formData.farmSizeUnit !== "hectare" && formData.farmSize && (
                  <p className="text-xs text-gray-500">
                    ≈ {Number(formData.farmSizeInHectares || 0).toFixed(4)}
                    hectares
                  </p>
                )}
              </div>

              <Input
                label="Number of Workers"
                name="numberOfWorkers"
                value={formData.numberOfWorkers || ""}
                onChange={handleChange}
              />

              {/* <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    Date of Registration
                  </label>
                  <input
                    type="date"
                    name="dateOfRegistration"
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    value={formData.dateOfRegistration || ""}
                    onChange={handleChange
                    }
                  />
                </div> */}
              <Select
                label="Registration Status"
                name="registrationStatus"
                value={formData.registrationStatus || ""}
                onChange={handleChange}
                options={["Active", "Inactive"]}
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleNext}
            disabled={!formData.lastName || !formData.firstName}
            className="px-6 py-2 rounded-lg text-white bg-green-600
             hover:bg-green-700 shadow-sm disabled:opacity-50"
          >
            Next →
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

const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={name} className="text-xs font-medium text-gray-600">
      {label}
    </label>

    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-xl text-xs p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
    />
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={name} className="text-xs font-medium text-gray-600">
      {label}
    </label>

    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-xl text-xs p-2 bg-white focus:ring-2 focus:ring-green-400 focus:outline-none"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
