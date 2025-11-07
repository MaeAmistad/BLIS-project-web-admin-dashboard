import React, { useState } from "react";
import Header from "../../components/header";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import AddItemModal from "../../components/AddItemModal";
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';

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
    <div className="flex bg-[#F5F5F5]">
      <Sidebarr />
      <div className="w-full">
        <Topbar /> n 
        <div className="flex justify-between items-center">
          <Header title="Inventory and Supplies" />
        </div>

        <div className="flex flex-col items-start gap-3 mt-4 mx-5">
            <div className="flex">
                <button
                    onClick={() => setOpenModal(true)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition w-full sm:w-auto"
                >
                    + Add Item
                </button>

                <button
                    className="flex items-center ml-3 gap-2 bg-gray-700 text-white px-5 py-3 rounded-xl shadow hover:bg-gray-800 transition"
                >
                    <SummarizeRoundedIcon/> 
                    Inventory Report
                </button>
            </div>
          
        </div>

        <div className="flex bg-white p-2 m-5 overflow-auto rounded-lg">
          <div className="w-full">
            <table className="table-auto w-full border-collapse rounded-lg overflow-hidden">
              <thead className="bg-gray-100 border-b-2 border-gray-200 rounded-t-lg">
                <tr>
                  {Rows.map((rows, index) => (
                    <th
                      key={index}
                      className="p-3 text-sm font-semibold tracking-wide text-center"
                    >
                      {rows.tableHeader}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr></tr>
              </tbody>
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
