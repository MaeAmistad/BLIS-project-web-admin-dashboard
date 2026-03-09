import React, { useState, useEffect } from "react";
import HealthRecordsModal from "./HealthModal";
import { AddCircleOutlineRounded, DeleteRounded } from "@mui/icons-material";
import HealthRecords from "./HealthRecords";

export default function LivestockEdit({
  open,
  onClose,
  onSave,
  initialData = [],
}) {
  const [healthOpen, setHealthOpen] = useState(false);
  const [activeLivestockIndex, setActiveLivestockIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [livestockList, setLivestockList] = useState([
    {
      id: "",
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

  useEffect(() => {
    if (!open) return;

    if (initialData?.length > 0) {
      setLivestockList(initialData);
    } else {
      setLivestockList([
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
    }
  }, [open, initialData]);

  const validators = {
    lettersOnly: /^[a-zA-Z\s]*$/,
    numbersOnly: /^[0-9]*$/,
  };

  const updateLivestock = (index, field, value) => {
    // Letters-only fields
    const lettersOnlyFields = [
      "livestockName",
      "breed",
      "colorMarkings",
      "healthCondition",
    ];

    if (lettersOnlyFields.includes(field)) {
      if (!validators.lettersOnly.test(value)) return;
    }

    // Numbers-only fields
    const numbersOnlyFields = ["weight"];

    if (numbersOnlyFields.includes(field)) {
      if (!validators.numbersOnly.test(value)) return;
    }

    setLivestockList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const handleConfirmSave = async () => {
    if (isSaving) return; 
    try {
      setIsSaving(true);
      await onSave(livestockList);
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
              Edit Livestock
            </h2>
            <p className="text-sm text-gray-500">
              Update details for each animal
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
                  Livestock
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

              
                </div>
              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    Livestock Name
                  </label>

                  <input
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
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
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
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
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
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
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
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
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    placeholder="Weight"
                    inputMode="numeric"
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
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
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
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
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
                    Date Acquired
                  </label>
                  <input
                    type="date"
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
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
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    inputMode="numeric"
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
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
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
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end mt-6 border-t pt-4">
          <button
            onClick={handleConfirmSave}
            disabled={isSaving}
            className="px-5 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Confirm & Save"}
          </button>
        </div>
      </div>

      {healthOpen && activeLivestockIndex !== null && (
        <HealthRecords
          open={healthOpen}
          onClose={() => setHealthOpen(false)}
          initialData={livestockList[activeLivestockIndex]?.healthRecords}
          onSubmit={(records, deletedIds) => {
            setLivestockList((prev) =>
              prev.map((l, i) =>
                i === activeLivestockIndex
                  ? { ...l, healthRecords: records }
                  : l,
              ),
            );

            setHealthOpen(false);
          }}
        />
      )}
    </div>
  );
}
