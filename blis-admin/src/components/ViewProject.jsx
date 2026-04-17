import React from 'react'

const ViewProject = ({ open, onClose,data}) => {
    if (!open || !data) return null;

  const Field = ({ label, value }) => (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">
        {value || "-"}
      </p>
    </div>
  );
   return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 relative">
      <button
            onClick={onClose}
            className="absolute top-3 right-3 text-red-500 hover:text-red-800 transition"
          >
            ✕
          </button>
        <h2 className="text-2xl font-semibold mb-4">
          Project Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-md">
          <Field label="Project Name" value={data.projectName} />
          <Field label="Description" value={data.description} />
          <Field label="Target Beneficiaries" value={data.targetBeneficiaries} />
           <Field label="animalType" value={data.animalType} />
          <Field label="Budget" value={data.budget ?? "-"} />
          <Field label="Status" value={data.status } />
          <Field
            label="Start Date"
            value={
              data.startDate
                ? new Date(data.startDate).toLocaleDateString()
                : "-"
            }
          />
          <Field
            label="End Date"
            value={
              data.endDate
                ? new Date(data.endDate).toLocaleDateString()
                : "-"
            }
          />
          
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewProject