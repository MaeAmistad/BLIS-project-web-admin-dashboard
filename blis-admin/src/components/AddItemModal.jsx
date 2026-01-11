import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase"; // adjust path
import { useAuth } from "./AuthContext";

const AddItemModal = ({ open, onClose, mode, inventory }) => {
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    brand: "",
    quantity: "",
    unit: "",
    supplier: "",
    dateAcquired: "",
    expirationDate: "",
    storageLocation: "",
    remarks: "",
  });

  useEffect(() => {
    if (!open) {
      setFormData({
        itemName: "",
        category: "",
        brand: "",
        quantity: "",
        unit: "",
        supplier: "",
        dateAcquired: "",
        expirationDate: "",
        storageLocation: "",
        remarks: "",
      });
    }
  }, [open]);

  useEffect(() => {
    if (mode === "edit" && inventory) {
      setFormData({
        itemName: inventory?.itemName || "",
        category: inventory?.category || "",
        brand: inventory?.brand || "",
        quantity: inventory?.quantity || "",
        unit: inventory?.unit || "",
        supplier: inventory?.supplier || "",
        dateAcquired: inventory?.dateAcquired || "",
        expirationDate: inventory?.expirationDate || "",
        storageLocation: inventory?.storageLocation || "",
        remarks: inventory?.remarks || "",
      });
    }
  }, [inventory, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) {
      Swal.fire("Error", "User not authenticated", "error");
      return;
    }

    if (loading) return;
    const result = await Swal.fire({
      title: mode === "edit" ? "Update Item?" : "Add Item?",
      text:
        mode === "edit"
          ? "Are you sure you want to update this item?"
          : "Are you sure you want to add this item?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: mode === "edit" ? "Yes, update it!" : "Yes, add it!",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      if (mode === "add") {
        // ADD
        await addDoc(collection(db, "inventories"), {
          ...formData,
          quantity: Number(formData.quantity),
          createdAt: serverTimestamp(),
          uid: user.uid,
        });

        Swal.fire({
          title: "Added!",
          text: "Item has been added successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        onClose();
        window.location.reload()
      } else if (mode === "edit" && inventory?.id) {
        // UPDATE
        const docRef = doc(db, "inventories", inventory.id);

        await updateDoc(docRef, {
          ...formData,
          quantity: Number(formData.quantity),
          updatedAt: serverTimestamp(),
        });

        Swal.fire({
          title: "Updated!",
          text: "Item has been updated successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      onClose();
      window.location.reload()
    } catch (error) {
      console.error("Firestore error:", error);
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
      setLoading(false);
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
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {mode === "edit" ? "Edit Inventory Item" : "Add Inventory Item"}
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
              className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
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
              className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Unit</label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Supplier</label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Date Acquired</label>
            <input
              type="date"
              name="dateAcquired"
              value={formData.dateAcquired}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Expiration Date</label>
            <input
              type="date"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
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
              className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-2 h-20 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleCloseConfirm}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-6 py-2 rounded-xl font-semibold shadow transition
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-green-600 hover:bg-green-700 text-white"
    }`}
          >
            {loading
              ? mode === "edit"
                ? "Updating..."
                : "Adding..."
              : mode === "edit"
              ? "Update Item"
              : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
