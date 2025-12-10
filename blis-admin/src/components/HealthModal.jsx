import React, { useState, useEffect } from "react";

export default function HealthRecordsModal({
  open,
  onClose,
  onSubmit,
  onPrevious,
  initialData = [], // array of arrays: health records per livestock
  livestockList = [], // array of livestock objects
}) {
  const [recordsPerLivestock, setRecordsPerLivestock] = useState([]);
  const [activeLivestock, setActiveLivestock] = useState(0);

  // Initialize records per livestock
  useEffect(() => {
    if (livestockList.length > 0) {
      setRecordsPerLivestock(
        livestockList.map((_, idx) => initialData[idx] || [{ date: "", type: "", description: "", veterinarian: "" }])
      );
    }
  }, [initialData, livestockList]);

  const updateRecord = (livestockIdx, recordIdx, field, value) => {
    setRecordsPerLivestock((prev) => {
      const updated = [...prev];
      updated[livestockIdx][recordIdx][field] = value;
      return updated;
    });
  };

  const addRecord = (livestockIdx) => {
    setRecordsPerLivestock((prev) => {
      const updated = [...prev];
      updated[livestockIdx].push({ date: "", type: "", description: "", veterinarian: "" });
      return updated;
    });
  };

  const removeRecord = (livestockIdx, recordIdx) => {
    setRecordsPerLivestock((prev) => {
      const updated = [...prev];
      updated[livestockIdx] = updated[livestockIdx].filter((_, i) => i !== recordIdx);
      return updated;
    });
  };

  const handleSubmit = () => {
    onSubmit(recordsPerLivestock);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-lg max-h-[80vh] overflow-y-auto animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-4 text-center">Health Records</h2>

        {/* Livestock Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {livestockList.map((animal, idx) => (
            <button
              key={idx}
              onClick={() => setActiveLivestock(idx)}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeLivestock === idx ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {animal.type || `Livestock #${idx + 1}`}
            </button>
          ))}
        </div>

        {/* Active Livestock Health Records */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto">
          {recordsPerLivestock[activeLivestock]?.map((record, rIdx) => (
            <div
              key={rIdx}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative"
            >
              {recordsPerLivestock[activeLivestock].length > 1 && (
                <button
                  onClick={() => removeRecord(activeLivestock, rIdx)}
                  className="absolute top-2 right-2 text-red-600 font-bold hover:text-red-800"
                >
                  &times;
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={record.date}
                    onChange={(e) => updateRecord(activeLivestock, rIdx, "date", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Record Type</label>
                  <input
                    type="text"
                    placeholder="Vaccination, Deworming, Medication"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={record.type}
                    onChange={(e) => updateRecord(activeLivestock, rIdx, "type", e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    placeholder="Details about the procedure, symptoms, etc."
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={record.description}
                    onChange={(e) => updateRecord(activeLivestock, rIdx, "description", e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Veterinarian</label>
                  <input
                    type="text"
                    placeholder="Vet name (optional)"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={record.veterinarian}
                    onChange={(e) => updateRecord(activeLivestock, rIdx, "veterinarian", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => addRecord(activeLivestock)}
          className="w-full mt-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition"
        >
          + Add Another Health Record
        </button>

        {/* Footer */}
        <div className="flex justify-between gap-3 mt-6">
          <button
            onClick={onPrevious}
            className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 font-medium"
            disabled={!onPrevious}
          >
            Previous
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
