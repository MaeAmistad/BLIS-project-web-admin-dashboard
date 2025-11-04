import React from "react";

const ViewLivestockDetailsModal = ({ open, onClose, livestock }) => {
  if (!open || !livestock) return null; // Don't render if closed

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
          Livestock Details
        </h2>

        {/* Location Details */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1">
          Location Details
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
          <div>
            <p className="font-medium text-gray-900">Farm Name (if any)</p>
            <p>{livestock.farmName || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Barangay / Municipality</p>
            <p>{livestock.barangay || "—"}</p>
          </div>
        </div>

        {/* Ownership Details */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1">
          Ownership Details
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
          <div>
            <p className="font-medium text-gray-900">Owner’s Full Name</p>
            <p>{livestock.ownerName || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Contact Number</p>
            <p>{livestock.contactNumber || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Type of Raiser</p>
            <p>{livestock.typeOfRaiser || "—"}</p>
          </div>
        </div>

        {/* Livestock Information */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1">
          Livestock Information
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
          <div>
            <p className="font-medium text-gray-900">Livestock Name</p>
            <p>{livestock.livestockName || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Type of Animal (Swine, etc.)</p>
            <p>{livestock.typeOfAnimal || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Breed</p>
            <p>{livestock.breed || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Gender</p>
            <p>{livestock.gender || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Age / Date of Birth</p>
            <p>{livestock.age || livestock.dateOfBirth || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Color / Markings</p>
            <p>{livestock.colorMarkings || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Health Condition</p>
            <p>{livestock.healthCondition || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Weight (optional)</p>
            <p>{livestock.weight || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Status</p>
            <p>{livestock.status || "—"}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center mt-8">
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

export default ViewLivestockDetailsModal;
