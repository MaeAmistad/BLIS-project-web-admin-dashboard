import React, { useState } from "react";
import { db } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore";

export default function ConfirmationModal({ open, onClose, data, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({
    raiser: true,
    livestock: true,
  });
  const [healthExpanded, setHealthExpanded] = useState(
    data.livestock.map(() => true)
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

  const handleSave = async () => {
    try {
      setLoading(true);

      // 1️⃣ Save RAISER
      const raiserRef = doc(collection(db, "raisers"));
      await setDoc(raiserRef, data.raiser);
      const raiserId = raiserRef.id;

      // 2️⃣ Save LIVESTOCK + HEALTH RECORDS
      for (let i = 0; i < data.livestock.length; i++) {
        const livestockRef = doc(collection(db, "raisers", raiserId, "livestock"));
        await setDoc(livestockRef, data.livestock[i]);

        const records = data.healthRecords[i] || [];
        for (const record of records) {
          const recordRef = doc(
            collection(db, "raisers", raiserId, "livestock", livestockRef.id, "healthRecords")
          );
          await setDoc(recordRef, record);
        }
      }

      setLoading(false);
      onConfirm();
    } catch (error) {
      console.error("Error saving data:", error);
      setLoading(false);
      alert("Error saving data. Check console for details.");
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
        <h2 className="text-2xl font-semibold mb-4 text-center">Confirm Submission</h2>
        <p className="text-gray-700 mb-6 text-center">
          Review all information carefully before saving. Once submitted, data will be stored in Firestore.
        </p>

        {/* RAISER */}
        <div className="border border-gray-200 rounded-lg mb-4 bg-gray-50">
          <button
            className="w-full text-left px-4 py-2 font-semibold hover:bg-gray-100 flex justify-between items-center"
            onClick={() => toggle("raiser")}
          >
            <span>Raiser Information</span>
            <span>{expanded.raiser ? "▲" : "▼"}</span>
          </button>
          {expanded.raiser && <div className="p-4">{renderObject(data.raiser)}</div>}
        </div>

        {/* LIVESTOCK */}
        <div className="border border-gray-200 rounded-lg mb-4 bg-gray-50">
          <button
            className="w-full text-left px-4 py-2 font-semibold hover:bg-gray-100 flex justify-between items-center"
            onClick={() => toggle("livestock")}
          >
            <span>Livestock</span>
            <span>{expanded.livestock ? "▲" : "▼"}</span>
          </button>
          {expanded.livestock && (
            <div className="p-4 space-y-3">
              {data.livestock.map((livestock, idx) => (
                <div key={idx} className="border border-gray-200 rounded p-3 bg-white">
                  <h4 className="font-medium mb-2">Livestock #{idx + 1}</h4>
                  {renderObject(livestock)}

                  {/* HEALTH RECORDS PER LIVESTOCK */}
                  <div className="mt-3 border-t border-gray-300 pt-2">
                    <button
                      className="w-full text-left font-medium hover:bg-gray-50 flex justify-between items-center"
                      onClick={() => toggleHealth(idx)}
                    >
                      <span>Health Records</span>
                      <span>{healthExpanded[idx] ? "▲" : "▼"}</span>
                    </button>
                    {healthExpanded[idx] && (
                      <div className="mt-2 space-y-2">
                        {data.healthRecords[idx]?.length === 0 ? (
                          <p className="text-gray-500 text-sm">No records</p>
                        ) : (
                          data.healthRecords[idx].map((record, rIdx) => (
                            <div
                              key={rIdx}
                              className="border-b border-gray-200 py-1 last:border-b-0"
                            >
                              {renderObject(record)}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            disabled={loading}
          >
            Back
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Confirm & Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
