import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Swal from "sweetalert2";
import { notifyAllUsers } from "./NotifyAllUsers";

const RaiserEdit = ({ open, onClose, raiserData }) => {
  const [formData, setFormData] = useState({
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
    typeOfRaiser: "",
    farmSizeUnit: "hectare", // default
    farmSizeInHectares: "",
  });

  console.log("Passed Raiser Data: ", raiserData);

  useEffect(() => {
    if (raiserData) {
      setFormData({
        address: raiserData?.address,
        contactNumber: raiserData?.contactNumber,
        email: raiserData?.email,
        firstName: raiserData?.firstName,
        farmLocation: raiserData?.farmLocation,
        farmSize: raiserData?.farmSize,
        farmSizeUnit: "hectare",
        farmSizeInHectares: raiserData?.farmSize || "",
        farmName: raiserData?.farmName,
        gender: raiserData?.gender,
        lastName: raiserData?.lastName,
        middleInitial: raiserData?.middleInitial,
        numberOfWorkers: raiserData?.numberOfWorkers,
        registrationStatus: raiserData?.registrationStatus,
        typeOfRaiser: raiserData?.typeOfRaiser,
      });
    }
  }, [raiserData]);

  const validators = {
    lettersOnly: /^[a-zA-Z\s]*$/,
    numbersOnly: /^[0-9]*\.?[0-9]*$/,
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

    // Contact number - numbers only, max 11 digits
    if (name === "contactNumber") {
      if (!validators.numbersOnly.test(value)) return;
      if (value.length > 11) return;
    }

    // Number of workers - numbers only
    if (name === "numberOfWorkers") {
      if (!validators.numbersOnly.test(value)) return;
    }

    // Farm size input
    if (name === "farmSize") {
      const converted = convertToHectares(value, formData.farmSizeUnit);

      setFormData((prev) => ({
        ...prev,
        farmSize: value,
        farmSizeInHectares: converted,
      }));
      return;
    }

    // Farm size unit selector
    if (name === "farmSizeUnit") {
      const converted = convertToHectares(formData.farmSize, value);

      setFormData((prev) => ({
        ...prev,
        farmSizeUnit: value,
        farmSizeInHectares: converted,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const raiserRef = doc(db, "raisers", raiserData.id);

      await updateDoc(raiserRef, {
        address: formData.address,
        contactNumber: formData.contactNumber,
        email: formData.email,
        farmLocation: formData.farmLocation,
        farmSize: formData.farmSizeInHectares || formData.farmSize,
        farmName: formData.farmName,
        gender: formData.gender,
        lastName: formData.lastName,
        middleInitial: formData.middleInitial,
        numberOfWorkers: formData.numberOfWorkers,
        registrationStatus: formData.registrationStatus,
        typeOfRaiser: formData.typeOfRaiser,
      });

      await notifyAllUsers({
        title: "Raiser Information Updated",
        message: `Record for Raiser ${formData.firstName} has been updated`,
        type: "edit",
      });

      Swal.fire({
        title: "Updated!",
        text: "Raiser info has been updated successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      onClose();
    } catch (error) {
      console.error("Error updating raiser:", error);
      Swal.fire(
        "Error!",
        "Something went wrong while saving. ",
        error,
        "error",
      );
    }
  };
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto
                 bg-white rounded-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Edit Raiser Information
              </h1>
            </div>

            <button onClick={onClose} className="text-red-500 text-xl">
              ✕
            </button>
          </div>


          <div className="p-6 space-y-6">
            <div className="bg-gray-50 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <Input
                  label="Middle Initial"
                  name="middleInitial"
                  value={formData.middleInitial}
                  onChange={handleChange}
                />

                <Input
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={["Male", "Female"]}
                />
                <Input
                  label="Contact No."
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  inputMode="numeric"
                />
                <Input
                  label="Barangay"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />

                <Select
                  label="Type of Raiser"
                  name="typeOfRaiser"
                  value={formData.typeOfRaiser}
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
                  value={formData.farmName}
                  onChange={handleChange}
                />
                <Input
                  label="Farm Location"
                  name="farmLocation"
                  value={formData.farmLocation}
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
                  value={formData.numberOfWorkers}
                  onChange={handleChange}
                  inputMode="numeric"
                />

               
                <Select
                  label="Registration Status"
                  name="registrationStatus"
                  value={formData.registrationStatus}
                  onChange={handleChange}
                  options={["Active", "Inactive"]}
                />
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
            <button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-lg text-white bg-green-600
             hover:bg-green-700 shadow-sm disabled:opacity-50"
            >
              Update Raiser
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaiserEdit;
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
      className="w-full border rounded-xl p-2 bg-white focus:ring-2 focus:ring-green-400 focus:outline-none"
    >
      <option value="" disabled>
        Select {label}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
