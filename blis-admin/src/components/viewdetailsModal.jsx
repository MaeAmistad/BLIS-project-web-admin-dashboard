import React from "react";

const ViewDetailsModal = ({ open, onClose, raiser }) => {
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
            <p>{raiser.dateOfRegistration|| "—"}</p>
          </div>
        </div>

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
