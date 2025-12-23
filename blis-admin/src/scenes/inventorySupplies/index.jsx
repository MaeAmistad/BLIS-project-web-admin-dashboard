import React, { useState } from "react";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import AddItemModal from "../../components/AddItemModal";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import Headerr from "../../components/Headerr";
import { AddCircleOutlineRounded } from "@mui/icons-material";

const InventoryandSupplies = () => {
  const [openModal, setOpenModal] = useState(false);
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

  const Rows = [
    { tableHeader: "Item Name" },
    { tableHeader: "Category" },
    { tableHeader: "Quantity Available" },
    { tableHeader: "Unit" },
    { tableHeader: "Reorder Level" },
    { tableHeader: "Expiration Date" },
    { tableHeader: "Actions" },
  ];

  const handleSave = () => {
    console.log("Item saved:", formData);
    // You can later replace this with Firestore addDoc()
    setOpenModal(false);
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
  };

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
            onClick={() => setOpenModal(true)}
          >
            <AddCircleOutlineRounded fontSize="small" />
            Add Inventory
          </button>
        </div>

        {/* <div className="flex flex-col items-start gap-3 mt-4 mx-5">
          <div className="flex">
           <button
                    onClick={() => setOpenModal(true)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition w-full sm:w-auto"
                >
                    + Add Item
                </button> 

            <button className="flex items-center ml-3 gap-2 bg-gray-700 text-white px-5 py-3 rounded-xl shadow hover:bg-gray-800 transition">
              <SummarizeRoundedIcon />
              Inventory Report
            </button>
          </div>
        </div> */}

        {/* Main Body */}
        <div className="m-1 mt-1 flex-grow overflow-y-auto bg-white-main shadow-md rounded-md">
          {/* SEARCH FILTERINGS */}
          <div className="p-1">
            <div>
              <div className="flex my-1 mx-1 space-x-1">
                <input
                  type="text"
                  placeholder="Search Inventory"
                  className="w-full sm:max-w-xs border border-green-400 focus:ring-2 focus:ring-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400"
                  // value={searchTerm}
                  // onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="relative overflow-y-auto h-[550px] border border-gray-300 rounded-md">
            <table className="min-w-[500px] w-full text-center">
              <thead className="h-6 bg-primary uppercase sticky top-0 text-white text-sm">
                <tr>
                  <th className="w-[50px]">NO</th>
                  <th className="w-[300px]">Item Name</th>
                  <th className="w-[150px]">Category</th>
                  <th className="w-[120px]">Quantity Available</th>
                  <th className="w-[220px]">Unit</th>
                  <th className="w-[150px]">Reorder Level</th>
                  <th className="w-[150px]">Expiration Date</th>
                  <th className="w-[150px]">Action</th>
                </tr>
              </thead>

              <tbody></tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        <AddItemModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default InventoryandSupplies;
