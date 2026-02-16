import React, { useEffect, useState } from "react";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import AddItemModal from "../../components/AddItemModal";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import Headerr from "../../components/Headerr";
import {
  AddCircleOutlineRounded,
  DeleteRounded,
  EditRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import { IconButton } from "@mui/material";
import ViewInventory from "../../components/ViewInventory";
import Swal from "sweetalert2";

const InventoryandSupplies = () => {
  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedInventory, setSelectedInventory] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [viewOpen, setViewOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isInventoryLoading, setIsInventoryLoading] = useState(true);

  useEffect(() => {
    setIsInventoryLoading(true);
    const q = query(collection(db, "inventories"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setInventories(data);

      // Extract unique categories dynamically
      const uniqueCategories = [
        ...new Set(data.map((item) => item.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
      setIsInventoryLoading(false);
    });
    

    return () => unsubscribe();
  }, []);

  const handleAdd = () => {
    setOpenModal(true);
    setMode("add");
    setSelectedInventory(null);
  };

  const handleEdit = (id) => {
    setOpenModal(true);
    setMode("edit");
    setSelectedInventory(id);
  };

  const handleView = (item) => {
    setSelectedInventory(item);
    setViewOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Item?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteDoc(doc(db, "inventories", id));

      Swal.fire({
        title: "Deleted!",
        text: "Item has been deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire("Error", "Failed to delete item.", "error");
    }
  };

  const getTimestamp = (ts) => {
  if (!ts) return 0;

  // Supports Firestore timestamp or JS Date
  if (ts.seconds) return ts.seconds * 1000;
  return new Date(ts).getTime();
};

  const filteredInventories = inventories.filter((item) => {
    // Check if itemName matches the search term (case-insensitive)
    const matchesSearch = item.itemName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Check if category matches the selectedCategory (or show all if none selected)
    const matchesCategory =
      selectedCategory === "" || item.category === selectedCategory;

    // Only include items that satisfy BOTH filters
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    const aLastActivity = Math.max(
      getTimestamp(a.createdAt),
      getTimestamp(a.updatedAt)
    );

    const bLastActivity = Math.max(
      getTimestamp(b.createdAt),
      getTimestamp(b.updatedAt)
    );

    return bLastActivity - aLastActivity; // newest first
  });

  return (
    <div className="app flex flex-col md:flex-row">
      <Sidebarr />
      <div className="content flex-grow p-2 overflow-auto h-screen">
        <Topbar />
        <div className="sticky top-14 flex flex-col md:flex-row items-start md:items-center justify-between p-1 m-2">
          <Headerr title="Inventory and Supplies" />

          <button
            className="mt-2 md:mt-0 bg-green-600 text-white text-sm py-2 px-3 rounded-lg
                         flex items-center gap-1"
            onClick={handleAdd}
          >
            <AddCircleOutlineRounded fontSize="small" />
            Add Inventory
          </button>
        </div>

        {/* Main Body */}
        <div className="m-1 mt-1 flex-grow overflow-y-auto bg-white-main shadow-md rounded-md">
          {/* SEARCH FILTERINGS */}
          <div className="p-1">
            <div className="flex flex-col sm:flex-row gap-2 my-1 mx-1">
              <input
                type="text"
                placeholder="Search Inventory"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:max-w-xs border border-green-400 rounded-lg px-3 py-2 text-xs"
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:max-w-xs border border-green-400 rounded-lg px-3 py-2 text-xs"
              >
                <option value="" className="text-sm">
                  All Categories
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="relative overflow-y-auto h-[550px] border border-gray-300 rounded-md">
            <table className="min-w-[500px] w-full text-center">
              <thead className="h-6 bg-primary uppercase sticky top-0 text-white text-sm z-10">
                <tr>
                  <th className="w-[50px]">NO</th>
                  <th className="w-[200px]">Item Name</th>
                  <th className="w-[120px]">Category</th>
                  <th className="w-[100px]">Quantity Available</th>
                  <th className="w-[100px]">Unit</th>
                  <th className="w-[220px]">Supplier</th>
                  <th className="w-[180px]">Storage Location</th>
                  <th className="w-[120px]">Acquired Date</th>
                  <th className="w-[120px]">Expiration Date</th>
                  <th className="w-[50px]">Action</th>
                </tr>
              </thead>

              <tbody>
                {isInventoryLoading ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="py-6 text-gray-500 text-sm text-center"
                    >
                      Loading inventory items...
                    </td>
                  </tr>
                ) : filteredInventories.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="py-6 text-gray-500 text-sm text-center"
                    >
                      No inventory items found
                    </td>
                  </tr>
                ) : (
                  filteredInventories.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-green-100 text-xs"
                    >
                      <td className="p-2 text-center border border-gray-400">
                        {index + 1}
                      </td>
                      <td className="p-2 text-center border border-gray-400">
                        {item.itemName}
                      </td>
                      <td className="p-2 text-center border border-gray-400">
                        {item.category ?? "-"}
                      </td>
                      <td className="p-2 text-center border border-gray-400">
                        {item.quantity ?? "-"}
                      </td>
                      <td className="p-2 text-center border border-gray-400">
                        {item.unit ?? "-"}
                      </td>
                      <td className="p-2 text-center border border-gray-400">
                        {item.supplier ?? "-"}
                      </td>
                      <td className="p-2 text-center border border-gray-400">
                        {item.storageLocation ?? "-"}
                      </td>
                      <td className="p-2 text-center border border-gray-400">
                        {item.dateAcquired
                          ? new Date(item.dateAcquired).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="p-2 text-center border border-gray-400">
                        {item.expirationDate
                          ? new Date(item.expirationDate).toLocaleDateString()
                          : "-"}
                      </td>
                      {/* Actions */}
                      <td className="p-2 text-center border border-gray-400">
                        <div className="flex justify-center">
                          <IconButton
                            aria-label="edit"
                            onClick={() => handleView(item)}
                          >
                            <VisibilityRounded
                              sx={{ color: "#e2c018ff", fontSize: 14 }}
                            />
                          </IconButton>
                          <IconButton
                            aria-label="edit"
                            onClick={() => handleEdit(item)}
                          >
                            <EditRounded
                              sx={{ color: "#266b0f", fontSize: 14 }}
                            />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={() => handleDelete(item.id)}
                          >
                            <DeleteRounded
                              sx={{ color: "#a30808", fontSize: 14 }}
                            />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {openModal && (
          <AddItemModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            mode={mode}
            inventory={selectedInventory}
          />
        )}

        {viewOpen && (
          <ViewInventory
            open={viewOpen}
            inventory={selectedInventory}
            onClose={() => setViewOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default InventoryandSupplies;
