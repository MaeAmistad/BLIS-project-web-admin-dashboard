import React, { useState, useEffect } from "react";

export default function LivestockModal({ open, onClose, onSave, onPrevious, initialData }) {
  const [livestockList, setLivestockList] = useState([{ type: "", breed: "", age: "", notes: "" }]);

  useEffect(() => {
    if (initialData && initialData.length > 0) setLivestockList(initialData);
  }, [initialData]);

  const addLivestock = () => {
    setLivestockList((prev) => [...prev, { type: "", breed: "", age: "", notes: "" }]);
  };

  const updateLivestock = (index, field, value) => {
    setLivestockList((prev) => {
      const newList = [...prev];
      newList[index][field] = value;
      return newList;
    });
  };

  const removeLivestock = (index) => {
    setLivestockList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    onSave(livestockList);
  };

  const handlePrevious = () => {
    if (onPrevious) onPrevious();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add Livestock</h2>

        <div className="space-y-5">
          {livestockList.map((item, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                  placeholder="Type"
                  value={item.type}
                  onChange={(e) => updateLivestock(idx, "type", e.target.value)}
                />
                <input
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                  placeholder="Breed"
                  value={item.breed}
                  onChange={(e) => updateLivestock(idx, "breed", e.target.value)}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-3 mt-3">
                <input
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                  placeholder="Age"
                  value={item.age}
                  onChange={(e) => updateLivestock(idx, "age", e.target.value)}
                />
                <input
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                  placeholder="Notes"
                  value={item.notes}
                  onChange={(e) => updateLivestock(idx, "notes", e.target.value)}
                />
              </div>

              {livestockList.length > 1 && (
                <div className="flex justify-end mt-3">
                  <button
                    className="text-red-600 hover:text-red-800 font-medium"
                    onClick={() => removeLivestock(idx)}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          className="w-full mt-4 py-2 text-blue-600 border border-blue-400 rounded-lg hover:bg-blue-50 font-medium"
          onClick={addLivestock}
        >
          + Add Another Livestock
        </button>

        <div className="flex justify-between gap-3 mt-6">
          <button
            className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 font-medium"
            onClick={handlePrevious}
            disabled={!onPrevious} // disable if no previous function
          >
            Previous
          </button>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 font-medium"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
