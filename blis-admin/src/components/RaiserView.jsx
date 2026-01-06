import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const EXCLUDED_FIELDS = ["id", "type", "createdAt", "updatedAt"];

const formatLabel = (key) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

const renderDynamicFields = (obj) =>
  Object.entries(obj).map(([key, value]) => {
    if (
      EXCLUDED_FIELDS.includes(key) ||
      value === "" ||
      value === null ||
      value === undefined
    ) {
      return null;
    }

    return (
      <p key={key} className="font-medium text-gray-900">
        <span>{formatLabel(key)}:</span> {String(value)}
      </p>
    );
  });

const RAISER_EXCLUDED_FIELDS = ["id"];

const renderInfoGrid = (obj) =>
  Object.entries(obj).map(([key, value]) => {
    if (
      RAISER_EXCLUDED_FIELDS.includes(key) ||
      value === "" ||
      value === null ||
      value === undefined
    ) {
      return null;
    }

    return (
      <div key={key} className="flex flex-col">
        <span className="font-medium text-gray-900">{formatLabel(key)}</span>
        <span className="text-gray-600">{String(value)}</span>
      </div>
    );
  });

const RaiserView = ({ visible, raiserInfo, onClose }) => {
  const [openHealth, setOpenHealth] = useState({});

  console.log("Passed Raiser Info: ", raiserInfo);

  const [livestock, setLivestock] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLivestockWithHealth = async (raiserId) => {
    const livestockRef = collection(db, "raisers", raiserId, "livestock");
    const livestockSnap = await getDocs(livestockRef);

    const livestockWithHealth = await Promise.all(
      livestockSnap.docs.map(async (livestockDoc) => {
        const livestockData = {
          id: livestockDoc.id,
          ...livestockDoc.data(),
        };

        const healthRef = collection(
          db,
          "raisers",
          raiserId,
          "livestock",
          livestockDoc.id,
          "healthRecords"
        );

        const healthSnap = await getDocs(healthRef);

        const healthRecords = healthSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return {
          ...livestockData,
          healthRecords,
        };
      })
    );

    return livestockWithHealth;
  };

  useEffect(() => {
    if (!raiserInfo?.id) return;

    const loadData = async () => {
      setLoading(true);
      const data = await fetchLivestockWithHealth(raiserInfo.id);
      setLivestock(data);
      setLoading(false);
    };

    loadData();
  }, [raiserInfo]);

  const toggleHealthRecords = (livestockId) => {
    setOpenHealth((prev) => ({
      ...prev,
      [livestockId]: !prev[livestockId],
    }));
  };

  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div
        className="bg-white rounded-xl w-full max-w-4xl p-6
                  max-h-[85vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-semibold">
              Raiser & Farm Information
            </h2>
            {/* <p className="text-gray-500 font-semibold text-sxl">
              {raiserInfo.firstName} {raiserInfo.lastName}
            </p> */}
          </div>

          <button
            onClick={onClose}
            className="text-red-500 text-xl font-semibold"
          >
            ✕
          </button>
        </div>

        {/* Raiser Info */}
        <div className="mb-8">
          {/* PERSONAL INFO */}
          <div className="border rounded-lg p-4 bg-gray-50 mb-2">
            <h3 className="font-semibold mb-3 text-sm text-gray-700">
              Personal Information
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {renderInfoGrid({
                firstName: raiserInfo.firstName,
                middleInitial: raiserInfo.middleInitial,
                lastName: raiserInfo.lastName,
                gender: raiserInfo.gender,
                contactNumber: raiserInfo.contactNumber,
                email: raiserInfo.email,
                barangay: raiserInfo.address,
              })}
            </div>
          </div>

          {/* FARM INFO */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-3 text-sm text-gray-700">
              Farm Information
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {renderInfoGrid({
                farmName: raiserInfo.farmName,
                farmLocation: raiserInfo.farmLocation,
                farmSize: raiserInfo.farmSize,
                numberOfWorkers: raiserInfo.numberOfWorkers,
                typeOfRaiser: raiserInfo.typeOfRaiser,
                registrationStatus: raiserInfo.registrationStatus,
                dateOfRegistration: raiserInfo.dateOfRegistration,
              })}
            </div>
          </div>
        </div>

        {/* Livestock */}
        <h3 className="text-xl font-semibold mb-2">Livestock Details</h3>

        {loading ? (
          <p>Loading livestock...</p>
        ) : livestock.length === 0 ? (
          <p className="text-gray-500">No livestock found</p>
        ) : (
          <div className="space-y-3">
            {livestock.map((animal, index) => (
              <div key={animal.id} className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold mb-2">Livestock {index + 1}</h4>

                {/* LIVESTOCK FIELDS (dynamic) */}
                {renderDynamicFields(animal)}

                {/* HEALTH RECORDS */}
                {animal.healthRecords?.length > 0 && (
                  <div className="mt-4 border-t pt-3">
                    <div className="space-y-3">
                      {/* HEALTH RECORDS DROPDOWN */}
                      {animal.healthRecords?.length > 0 && (
                        <div className="mt-3">
                          <div
                            onClick={() => toggleHealthRecords(animal.id)}
                            className="flex items-center justify-between cursor-pointer select-none"
                          >
                            <h5 className="font-semibold text-base text-blue-600">
                              Health Records
                            </h5>

                            <span className="text-xs p-1.5 rounded rounded-lg text-white bg-primary">
                              {openHealth[animal.id]
                                ? "Close Details ▼"
                                : "Open Details ▶"}
                            </span>
                          </div>

                          {openHealth[animal.id] && (
                            <div className="mt-3 border-t pt-3 space-y-3">
                              {animal.healthRecords.map((record) => (
                                <div
                                  key={record.id}
                                  className="border rounded-md p-3 bg-white"
                                >
                                  {record.type && (
                                    <p className="font-semibold text-sm mb-1 capitalize">
                                      {record.type}
                                    </p>
                                  )}

                                  {renderDynamicFields(record)}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RaiserView;
