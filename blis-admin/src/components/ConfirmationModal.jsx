import React, { useState } from "react";

export default function ConfirmationModal({
  open,
  onClose,
  onCancel,
  data,
  onConfirm,
}) {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({
    raiser: true,
    livestock: true,
  });
  const [healthExpanded, setHealthExpanded] = useState(
    () => data?.livestock?.map(() => true) || []
  );

  if (!open) return null;

  const toggle = (section) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleHealth = (idx) => {
    setHealthExpanded((prev) => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  // const handleSave = async () => {
  //   try {
  //     setLoading(true);

  //     // 1️⃣ Save Raiser
  //     const raiserRef = doc(collection(db, "raisers"));
  //     await setDoc(raiserRef, data.raiser);
  //     const raiserId = raiserRef.id;

  //     // 2️⃣ Save Livestock + Health Records
  //     for (const livestock of data.livestock) {
  //       const { healthRecords, ...livestockData } = livestock;

  //       // Save livestock document (WITHOUT healthRecords)
  //       const livestockRef = doc(
  //         collection(db, "raisers", raiserId, "livestock")
  //       );
  //       await setDoc(livestockRef, livestockData);

  //       // Save health records as subcollection
  //       if (healthRecords) {
  //         const recordTypes = [
  //           { key: "vaccinations", type: "vaccination" },
  //           { key: "dewormings", type: "deworming" },
  //           { key: "treatments", type: "treatment" },
  //           { key: "aiRecords", type: "ai" },
  //         ];

  //         for (const { key, type } of recordTypes) {
  //           const records = healthRecords[key] || [];

  //           for (const record of records) {
  //             await setDoc(
  //               doc(
  //                 collection(
  //                   db,
  //                   "raisers",
  //                   raiserId,
  //                   "livestock",
  //                   livestockRef.id,
  //                   "healthRecords"
  //                 )
  //               ),
  //               {
  //                 ...record,
  //                 type,
  //               }
  //             );
  //           }
  //         }
  //       }
  //     }

  //     setLoading(false);
  //     onConfirm();
  //   } catch (error) {
  //     console.error("Error saving data:", error);
  //     setLoading(false);
  //     alert("Error saving data. Check console for details.");
  //   }
  // };

  const handleConfirm = async () => {
    // Prevent double click
    if (loading) return;

    try {
      setLoading(true);
      await onConfirm(); // submit to server
    } finally {
      setLoading(false);
    }
  };

  const renderObject = (obj) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {Object.entries(obj).map(([key, value]) => (
        <div key={key} className="flex gap-2">
          <span className="font-medium capitalize">{key}:</span>
          <span>{value?.toString() || "-"}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-lg max-h-[80vh] overflow-y-auto animate-fadeIn">
        <div className="relative mb-4">
          <h2 className="text-2xl font-semibold text-center">
            Confirm Submission
          </h2>

          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-red-500 text-xl font-semibold leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-700 mb-6 text-center">
          Review all information carefully before saving. Once submitted, data
          will be stored in Firestore.
        </p>

        {/* RAISER */}
        <div className="border border-gray-200 rounded-lg mb-4 bg-gray-50">
          <button
            className="w-full text-left px-4 py-2 font-semibold hover:bg-gray-100 flex justify-between items-center"
            onClick={() => toggle("raiser")}
          >
            <span>Raiser Information</span>
            <span>{expanded.raiser ? "▼" : "▲"}</span>
          </button>
          {expanded.raiser && (
            <div className="p-4">{renderObject(data.raiser)}</div>
          )}
        </div>

        {/* LIVESTOCK */}
        <div className="border border-gray-200 rounded-lg mb-4 bg-gray-50">
          <button
            className="w-full text-left px-4 py-2 font-semibold hover:bg-gray-100 flex justify-between items-center"
            onClick={() => toggle("livestock")}
          >
            <span>Livestock</span>
            <span>{expanded.livestock ? "▼" : "▲"}</span>
          </button>
          {expanded.livestock && (
            <div className="p-4 space-y-3">
              {data.livestock.map((livestock, idx) => {
                const { healthRecords, ...livestockInfo } = livestock;

                const health = healthRecords || {};
                const allRecords = [
                  ...(health.vaccinations || []),
                  ...(health.dewormings || []),
                  ...(health.treatments || []),
                  ...(health.aiRecords || []),
                ];

                return (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded p-3 bg-white"
                  >
                    <h4 className="font-medium mb-2">Livestock #{idx + 1}</h4>

                    {renderObject(livestockInfo)}

                    {/* HEALTH RECORDS */}
                    <div className="mt-3 border-t border-gray-300 pt-2">
                      <button
                        className="w-full text-left font-medium hover:bg-gray-50 flex justify-between items-center"
                        onClick={() => toggleHealth(idx)}
                      >
                        <span>Health Records</span>
                        <span>{healthExpanded[idx] ? "Close Details ▼"
                              : "Open Details ▶"}</span>
                      </button>

                      {healthExpanded[idx] && (
                        <div className="mt-2 space-y-2">
                          {allRecords.length === 0 ? (
                            <p className="text-gray-500 text-sm">No records</p>
                          ) : (
                            allRecords.map((record, rIdx) => (
                              <div key={rIdx} className="border-b py-1">
                                {renderObject(record)}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg text-white transition
        ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-primary hover:bg-green-700"
        }`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Confirm & Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
