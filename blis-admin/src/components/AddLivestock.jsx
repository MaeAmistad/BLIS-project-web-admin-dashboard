import React, { useEffect, useState } from "react";
import AddHealthRecords from "./AddHealthRecord";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import Swal from "sweetalert2";
import { notifyAllUsers } from "./NotifyAllUsers";
import { AddCircleOutlineRounded, DeleteRounded } from "@mui/icons-material";

const AddLivestock = ({ open, onClose, raiserData }) => {
  console.log("Raiser Data: ", raiserData);
  const [healthOpen, setHealthOpen] = useState(false);
  const [activeLivestockIndex, setActiveLivestockIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [livestockList, setLivestockList] = useState([
    {
      breed: "",
      age: "",
      colorMarkings: "",
      gender: "",
      healthCondition: "",
      livestockName: "",
      status: "",
      typeOfAnimal: "",
      weight: "",
      healthRecords: {
        vaccinations: [],
        dewormings: [],
        treatments: [],
        aiRecords: [],
      },
    },
  ]);

  const animalOptions = [
    "Horse",
    "Cattle",
    "Swine",
    "Goat",
    "Duck",
    "Chicken",
    "Ostrich",
    "Carabao",
    "Dog",
    "Cat",
  ];

  const addLivestock = () => {
    setLivestockList((prev) => [
      ...prev,
      {
        breed: "",
        age: "",
        colorMarkings: "",
        gender: "",
        healthCondition: "",
        livestockName: "",
        status: "",
        typeOfAnimal: "",
        weight: "",
        healthRecords: {
          vaccinations: [],
          dewormings: [],
          treatments: [],
          aiRecords: [],
        },
      },
    ]);
  };

  const updateLivestock = (index, field, value) => {
    setLivestockList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const validateLivestock = () => {
    if (livestockList.length === 0) {
      Swal.fire("Error", "Please add at least one livestock.", "error");
      return false;
    }

    for (let i = 0; i < livestockList.length; i++) {
      const animal = livestockList[i];
      if (!animal.livestockName || !animal.typeOfAnimal) {
        Swal.fire(
          "Error",
          `Livestock #${i + 1} requires a name and type.`,
          "error",
        );
        return false;
      }
    }

    return true;
  };

  const removeLivestock = (index) => {
    setLivestockList((prev) => prev.filter((_, i) => i !== index));
  };

  const saveHealthRecords = async ({
    raiserId,
    livestockId,
    healthRecords,
  }) => {
    console.log("🩺 Saving health records for:", { raiserId, livestockId });

    const healthRef = collection(
      db,
      "raisers",
      raiserId,
      "livestock",
      livestockId,
      "healthRecords",
    );

    const recordGroups = [
      { type: "vaccination", records: healthRecords.vaccinations },
      { type: "deworming", records: healthRecords.dewormings },
      { type: "treatment", records: healthRecords.treatments },
      { type: "ai", records: healthRecords.aiRecords },
    ];

    for (const group of recordGroups) {
      if (!group.records?.length) continue;

      console.log(`➕ Adding ${group.records.length} ${group.type} record(s)`);

      for (const record of group.records) {
        await addDoc(healthRef, {
          ...record, // ✅ spread fields at root
          type: group.type, // ✅ discriminator
          createdAt: serverTimestamp(),
        });
      }
    }
  };

  const handleSaveLivestock = async () => {
    if (isSaving) return;
    if (!validateLivestock()) return;

    if (!raiserData?.id) {
      alert("Invalid raiser ID");
      return;
    }
    setIsSaving(true);

    try {
      const livestockRef = collection(
        db,
        "raisers",
        raiserData.id,
        "livestock",
      );

      for (const animal of livestockList) {
        // 1️⃣ Create livestock document
        const livestockDoc = await addDoc(livestockRef, {
          livestockName: animal.livestockName,
          typeOfAnimal: animal.typeOfAnimal,
          breed: animal.breed,
          age: animal.age,
          gender: animal.gender,
          weight: animal.weight,
          colorMarkings: animal.colorMarkings,
          status: animal.status,
          healthCondition: animal.healthCondition,
          dateOfBirth: animal.dateOfBirth || null,
          createdAt: serverTimestamp(),
        });

        // 2️⃣ Save health records (multiple schemas supported)
        await saveHealthRecords({
          raiserId: raiserData.id,
          livestockId: livestockDoc.id,
          healthRecords: animal.healthRecords,
        });
      }

      await notifyAllUsers({
        title: "New Livestock",
        message: `A new livestock was added for ${raiserData.raiserName}.`,
        type: "add",
      });

      // Notify admin
      Swal.fire({
        icon: "success",
        title: "Livestock Added!",
        text: "Another Livestock Added Successfuly",
        showConfirmButton: false,
        timer: 1500,
      });
      console.log(
        " Finished adding livestock and health records for raiser:",
        raiserData.raiserName,
      );
      onClose();
    } catch (err) {
      console.error("Error saving livestock:", err);
      Swal.fire({
        icon: "error",
        title: "Adding Livestock failed",
        text: err.message,
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl mx-4 p-6 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="mb-6 border-b pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Add Another Livestock for {raiserData.raiserName}
            </h2>
            <p className="text-sm text-gray-500">
              Provide details for each animal
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-red-500 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* LIVESTOCK LIST */}
        <div className="space-y-6">
          {livestockList.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm"
            >
              {/* Card Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  Livestock #{idx + 1}
                </h3>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setActiveLivestockIndex(idx);
                      setHealthOpen(true);
                    }}
                    className="text-xs bg-primary text-white p-1 rounded rounded-md font-medium"
                  >
                    <AddCircleOutlineRounded fontSize="small" />
                    Add Health Records
                  </button>

                  {livestockList.length > 1 && (
                    <button
                      onClick={() => removeLivestock(idx)}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      <DeleteRounded fontSize="small" />
                    </button>
                  )}
                </div>
              </div>

              {/* GRID — 3 COLUMNS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    Livestock Name
                  </label>

                  <input
                    className="p-2 text-xs rounded-md border focus:ring-1 focus:ring-green-400"
                    placeholder="Livestock Name"
                    value={item.livestockName || ""}
                    onChange={(e) =>
                      updateLivestock(idx, "livestockName", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    Type Of Animal
                  </label>
                  <select
                    className="p-2 text-xs border rounded-md focus:ring-2 focus:ring-green-400"
                    value={item.typeOfAnimal || ""}
                    onChange={(e) =>
                      updateLivestock(idx, "typeOfAnimal", e.target.value)
                    }
                  >
                    <option value="">Select Type of Animal</option>
                    {animalOptions.map((animal) => (
                      <option key={animal} value={animal}>
                        {animal}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    Breed
                  </label>
                  <input
                    className="p-2 text-xs border rounded-md focus:ring-2 focus:ring-green-400"
                    placeholder="Breed"
                    value={item.breed || ""}
                    onChange={(e) =>
                      updateLivestock(idx, "breed", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    Color / Markings
                  </label>
                  <input
                    className="p-2 text-xs border rounded-md focus:ring-2 focus:ring-green-400"
                    placeholder="Color / Markings"
                    value={item.colorMarkings || ""}
                    onChange={(e) =>
                      updateLivestock(idx, "colorMarkings", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    Weight
                  </label>

                  <input
                    className="p-2 text-xs border rounded-md focus:ring-2 focus:ring-green-400"
                    placeholder="Weight"
                    value={item.weight || ""}
                    onChange={(e) =>
                      updateLivestock(idx, "weight", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    Health Condition
                  </label>
                  <input
                    className="p-2 text-xs border rounded-md focus:ring-2 focus:ring-green-400"
                    placeholder="Health Condition"
                    value={item.healthCondition || ""}
                    onChange={(e) =>
                      updateLivestock(idx, "healthCondition", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    Gender
                  </label>
                  <select
                    className="p-2 text-xs border rounded-md focus:ring-2 focus:ring-green-400"
                    value={item.gender || ""}
                    onChange={(e) =>
                      updateLivestock(idx, "gender", e.target.value)
                    }
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    Date
                  </label>
                  <input
                    type="date"
                    className="p-2 text-xs border rounded-md focus:ring-2 focus:ring-green-400"
                    value={item.dateOfBirth || ""}
                    onChange={(e) =>
                      updateLivestock(idx, "dateOfBirth", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    Age
                  </label>
                  <input
                    className="p-2 text-xs border rounded-md focus:ring-2 focus:ring-green-400"
                    placeholder="Age"
                    value={item.age || ""}
                    onChange={(e) =>
                      updateLivestock(idx, "age", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    Status
                  </label>
                  <select
                    className="p-2 text-xs border rounded-md focus:ring-2 focus:ring-green-400"
                    value={item.status || ""}
                    onChange={(e) =>
                      updateLivestock(idx, "status", e.target.value)
                    }
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-600">
                      Barangay
                    </label>
                    <input
                      className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                      placeholder="Barangay"
                      value={item.barangay || ""}
                      onChange={(e) =>
                        updateLivestock(idx, "barangay", e.target.value)
                      }
                    />
                  </div> */}
              </div>
            </div>
          ))}
        </div>

        {/* ADD BUTTON */}
        <button
          onClick={addLivestock}
          className="w-full mt-5 py-2 border border-blue-500 text-sm text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
        >
          + Add Another Livestock
        </button>

        {/* FOOTER */}
        <div className="flex justify-end items-center mt-6 border-t pt-4">
          <div className="flex gap-3">
            <button className="px-5 py-2 border rounded-lg hover:bg-gray-100">
              Cancel
            </button>
            <button
              className="px-6 py-2 rounded-lg text-white bg-green-600
               hover:bg-green-700 shadow-sm disabled:opacity-50"
              onClick={handleSaveLivestock}
              disabled={isSaving}
            >
              Add{" "}
              {isSaving && (
                <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
            </button>
          </div>
        </div>
      </div>

      {healthOpen && activeLivestockIndex !== null && (
        <AddHealthRecords
          open={healthOpen}
          initialData={livestockList[activeLivestockIndex].healthRecords}
          onSubmit={(records) => {
            setLivestockList((prev) =>
              prev.map((animal, i) =>
                i === activeLivestockIndex
                  ? {
                      ...animal,
                      healthRecords: {
                        vaccinations: records.vaccinations || [],
                        dewormings: records.dewormings || [],
                        treatments: records.treatments || [],
                        aiRecords: records.aiRecords || [],
                      },
                    }
                  : animal,
              ),
            );

            setHealthOpen(false);
            setActiveLivestockIndex(null);
          }}
          onClose={() => {
            setHealthOpen(false);
            setActiveLivestockIndex(null);
          }}
        />
      )}
    </div>
  );
};

export default AddLivestock;
