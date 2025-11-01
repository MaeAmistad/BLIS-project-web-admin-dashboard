import React from "react";

const ViewDetailsModal = ({ open, onClose, raiser }) => {
  if (!open || !raiser) return null; // Don't render if closed

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl mx-4 p-6 relative">
        
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

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
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
            <p>{raiser.farmsize || "—"}</p>
          </div>

          <div>
            <p className="font-medium text-gray-900">No. of Workers</p>
            <p>{raiser.numberOfWorkers || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Registration Status</p>
            <p>{raiser.registrationStatus || "—"}</p>
          </div>

          <div>
            <p className="font-medium text-gray-900">Date Registered</p>
            <p>{raiser.createdAt || "—"}</p>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal;
