import React from 'react'

const ViewInventory = ({ open, onClose, inventory }) => {
  if (!open || !inventory) return null;

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
        <h2 className="text-2xl font-semibold mb-4">
          Inventory Item Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-md">
          <Field label="Item Name" value={inventory.itemName} />
          <Field label="Brand" value={inventory.brand} />
          <Field label="Category" value={inventory.category} />
          <Field label="Quantity" value={inventory.quantity} />
          <Field label="Unit" value={inventory.unit} />
          <Field label="Supplier" value={inventory.supplier} />
          <Field
            label="Date Acquired"
            value={
              inventory.dateAcquired
                ? new Date(inventory.dateAcquired).toLocaleDateString()
                : "-"
            }
          />
          <Field
            label="Expiration Date"
            value={
              inventory.expirationDate
                ? new Date(inventory.expirationDate).toLocaleDateString()
                : "-"
            }
          />
          <Field label="Storage Location" value={inventory.storageLocation} />
          <div className="sm:col-span-2">
            <Field label="Remarks" value={inventory.remarks} />
          </div>
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
};


export default ViewInventory