import { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Swal from "sweetalert2";
import Header from "../../components/header";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import LivestockModal from "../../components/livestockmodal";
import ViewLivestockDetailsModal from "../../components/ViewLivestockDetailsModal";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

const LivestockInventory = () => {
  const [livestocks, setLivestocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedLivestock, setSelectedLivestock] = useState(null);
  const [editData, setEditData] = useState(null);

  const Rows = [
    { tableHeader: "Livestock Name" },
    { tableHeader: "Type of Animal" },
    { tableHeader: "Breed" },
    { tableHeader: "Owner Name" },
    { tableHeader: "Barangay" },
    { tableHeader: "Health Condition" },
    { tableHeader: "Status" },
    { tableHeader: "Actions" },
  ];

  // Fetch all livestock data
  const fetchLivestock = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "livestock"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLivestocks(data);
    } catch (error) {
      console.error("Error fetching livestock:", error);
      Swal.fire("Error", "Failed to load livestock data.", "error");
    }
  };

  useEffect(() => {
    fetchLivestock();
  }, []);

  // Save new or edited livestock
  const handleSave = async (data) => {
    try {
      if (editData) {
        const docRef = doc(db, "livestock", editData.id);
        await updateDoc(docRef, data);
        Swal.fire("Updated!", "Livestock information updated successfully.", "success");
      } else {
        const newDoc = doc(collection(db, "livestock"));
        await setDoc(newDoc, data);
        Swal.fire("Added!", "New livestock record added successfully.", "success");
      }

      fetchLivestock();
      setOpen(false);
    } catch (error) {
      console.error("Error saving livestock:", error);
      Swal.fire("Error", "Something went wrong while saving.", "error");
    }
  };

  // Delete livestock
  const handleDelete = async (livestock) => {
    const confirm = await Swal.fire({
      title: "Delete Livestock?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    });

    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "livestock", livestock.id));
      Swal.fire("Deleted!", "Livestock has been removed.", "success");
      fetchLivestock();
    }
  };

  // View livestock details
  const handleView = (livestock) => {
    setSelectedLivestock(livestock);
    setViewOpen(true);
  };

  const handleEdit = (livestock) => {
    setEditData(livestock);
    setOpen(true);
  };

  // Search filter
  const filteredLivestock = livestocks.filter((l) => {
    const term = searchTerm.toLowerCase();
    return (
      (l.livestockName?.toLowerCase() || "").includes(term) ||
      (l.breed?.toLowerCase() || "").includes(term) ||
      (l.ownerName?.toLowerCase() || "").includes(term)
    );
  });

  return (
    <div className="flex bg-[#F5F5F5] min-h-screen">
      <Sidebarr />
      <div className="w-full">
        <Topbar />
        <Header title="Livestock Inventory" />

        {/* Modals */}
        <LivestockModal open={open} onClose={() => setOpen(false)} onSave={handleSave} initialData={editData} />
        <ViewLivestockDetailsModal open={viewOpen} onClose={() => setViewOpen(false)} livestock={selectedLivestock} />

        {/* Controls */}
        <div className="flex flex-col items-start gap-3 mt-4 mx-5">

          <input
            type="text"
            placeholder="Search Bar"
            className="w-full sm:max-w-sm border border-green-400 focus:ring-2 focus:ring-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="flex bg-white p-4 m-5 rounded-lg shadow-md overflow-x-auto">
          <table className="table-auto w-full border-collapse rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-100 border-b-2 border-gray-300 text-gray-700">
              <tr>
                {Rows.map((row, i) => (
                  <th key={i} className="p-3 font-semibold tracking-wide text-center whitespace-nowrap">
                    {row.tableHeader}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLivestock.length > 0 ? (
                filteredLivestock.map((l) => (
                  <tr key={l.id} className="border-b hover:bg-green-50 text-center transition text-gray-700">
                    <td className="p-3 whitespace-nowrap">{l.livestockName}</td>
                    <td className="p-3 whitespace-nowrap">{l.typeOfAnimal}</td>
                    <td className="p-3 whitespace-nowrap">{l.breed}</td>
                    <td className="p-3 whitespace-nowrap">{l.ownerName}</td>
                    <td className="p-3 whitespace-nowrap">{l.barangay}</td>
                    <td className="p-3 whitespace-nowrap">{l.healthCondition}</td>
                    <td className="p-3 whitespace-nowrap">{l.status}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => handleView(l)}
                        className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-xs font-medium transition"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleEdit(l)}
                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md transition"
                      >
                        <EditRoundedIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(l)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition"
                      >
                        <DeleteRoundedIcon />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={Rows.length} className="text-center py-6 text-gray-500">
                    No livestock records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LivestockInventory;
