import React, { useEffect, useState } from "react";
import { db } from "../firebase.js";
import { collection, getDocs } from "firebase/firestore";

const ViewDetailsModal = ({ open, onClose, raiser }) => {
  const [livestockList, setLivestockList] = useState([]);
  const [loadingLivestock, setLoadingLivestock] = useState(false);

  useEffect(() => {
    const fetchLivestock = async () => {
      if (!raiser?.id) return;

      try {
        setLoadingLivestock(true);

        const livestockRef = collection(db, "raisers", raiser.id, "livestock");

        const snapshot = await getDocs(livestockRef);

        const rawData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const grouped = rawData.reduce((acc, item) => {
          const type = item.typeOfAnimal || item.animalType || "Unknown";

          if (!acc[type]) {
            acc[type] = {
              type,
              count: 0,
              breed: item.breed || "—",
            };
          }

          acc[type].count += 1;

          return acc;
        }, {});

        const groupedList = Object.values(grouped);

        setLivestockList(groupedList);
      } catch (error) {
        console.error("Error fetching livestock:", error);
      } finally {
        setLoadingLivestock(false);
      }
    };

    if (open) {
      fetchLivestock();
    }
  }, [raiser, open]);

  if (!open || !raiser) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl mx-4 p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-green-700 mb-4 text-center">
          Raiser Details
        </h2>

        {/* Raiser Info */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1">
          Personal & Farm Information
        </h3>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
          <div>
            <p className="font-medium text-gray-900">Full Name</p>
            <p>{`${raiser.lastName || ""}, ${raiser.firstName || ""} ${raiser.middleInitial || ""}`}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Gender</p>
            <p>{raiser.gender || "—"}</p>
          </div>

          <div>
            <p className="font-medium text-gray-900">Contact Number</p>
            <p>{raiser.contact || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Address / Barangay</p>
            <p>{raiser.address || "—"}</p>
          </div>

          <div>
            <p className="font-medium text-gray-900">Type of Raiser</p>
            <p>{raiser.typeOfRaiser || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Farm Name</p>
            <p>{raiser.farmName || "—"}</p>
          </div>

          <div>
            <p className="font-medium text-gray-900">Farm Location</p>
            <p>{raiser.farmLocation || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Farm Size</p>
            <p>{raiser.farmSize || "—"}</p>
          </div>

          <div>
            <p className="font-medium text-gray-900">No. of Workers</p>
            <p>{raiser.numberOfWorkers || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Registration Status</p>
            <p>{raiser.registrationStatus || "—"}</p>
          </div>

          <div className="col-span-2">
            <p className="font-medium text-gray-900">Date Registered</p>
            <p>{raiser.dateOfRegistration || "—"}</p>
          </div>
        </div>

        {/* Livestock Section */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1">
          Livestock Information
        </h3>

        {loadingLivestock ? (
          <p className="text-sm text-gray-500">Loading livestock...</p>
        ) : livestockList.length === 0 ? (
          <p className="text-sm text-gray-500">No livestock found.</p>
        ) : (
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Breed</th>
                  <th className="p-2 border">Count</th>
                </tr>
              </thead>
              <tbody>
                {livestockList.map((livestock, index) => (
                  <tr key={index} className="text-center">
                    <td className="p-2 border">{livestock.type}</td>
                    <td className="p-2 border">{livestock.breed}</td>
                    <td className="p-2 border font-semibold text-green-700">
                      {livestock.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-center mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal;
