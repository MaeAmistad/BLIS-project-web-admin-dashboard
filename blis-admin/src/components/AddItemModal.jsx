import React from "react";
import Swal from "sweetalert2";

const AddItemModal = ({ open, onClose, formData, setFormData, onSave }) => {
  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const result = await Swal.fire({
      title: "Save Item?",
      text: "Are you sure you want to save this item?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    });

    if (result.isConfirmed) {
      Swal.fire("Saved!", "Item has been added successfully.", "success");
      onSave(); // callback to parent
    }
  };

  const handleCloseConfirm = async () => {
      const result = await Swal.fire({
        title: "Discard changes?",
        text: "Any unsaved data will be lost.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, close it",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#dc2626",
      });
  
      if (result.isConfirmed) {
        onClose();
      }
    };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Add Inventory Item
        </h2>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Item Name</label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Category Radio Buttons */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Category</label>
            <div className="flex flex-wrap gap-4">
              {[
                "vaccine",
                "dewormer",
                "medicine",
                "semen",
                "equipment",
                "feed",
              ].map((cat) => (
                <label key={cat} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={formData.category === cat}
                    onChange={handleChange}
                  />
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Unit</label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Supplier</label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Date Acquired</label>
            <input
              type="date"
              name="dateAcquired"
              value={formData.dateAcquired}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Expiration Date</label>
            <input
              type="date"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Storage Location
            </label>
            <input
              type="text"
              name="storageLocation"
              value={formData.storageLocation}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 h-20 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleCloseConfirm}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
