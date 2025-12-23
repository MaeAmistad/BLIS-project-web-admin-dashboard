import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import Swal from "sweetalert2";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import LivestockModal from "../../components/livestockmodal";
import ViewLivestockDetailsModal from "../../components/ViewLivestockDetailsModal";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Headerr from "../../components/Headerr";
import { IconButton } from "@mui/material";
import {
  DeleteRounded,
  EditRounded,
  VisibilityRounded,
} from "@mui/icons-material";

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
        Swal.fire(
          "Updated!",
          "Livestock information updated successfully.",
          "success"
        );
      } else {
        const newDoc = doc(collection(db, "livestock"));
        await setDoc(newDoc, data);
        Swal.fire(
          "Added!",
          "New livestock record added successfully.",
          "success"
        );
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
    <div className="app flex flex-col md:flex-row">
      <Sidebarr />
      <div className="content flex-grow p-2 overflow-auto h-screen">
        <Topbar />
        <div className="sticky top-14 flex flex-col md:flex-row items-start md:items-center justify-between p-1 m-2">
          <Headerr title="Livestock Inventory" />
        </div>

        {/* Main Body */}
        <div className="m-1 mt-1 flex-grow overflow-y-auto bg-white-main shadow-md rounded-md">
          {/* Search Filters */}
          <div className="p-1">
            <div>
              <div className="flex my-1 mx-1 space-x-1">
                <input
                  type="text"
                  placeholder="Search Bar"
                  className="w-full sm:max-w-sm border border-green-400 focus:ring-2 focus:ring-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="relative overflow-y-auto h-[550px] border border-gray-300 rounded-md">
            <table cclassName="min-w-[500px] w-full text-center">
              <thead className="h-6 bg-primary uppercase sticky top-0 text-white text-sm">
                <tr>
                  <th className="w-[50px]">NO</th>
                  <th className="w-[300px]">Raiser Name</th>
                  <th className="w-[150px]">Barangay</th>
                  <th className="w-[120px]">No. of Livestock</th>
                  <th className="w-[220px]">Registration Status</th>
                  <th className="w-[150px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLivestock.length > 0 ? (
                  filteredLivestock.map((l, index) => (
                    <tr
                      key={l.id}
                      className="border-b hover:bg-green-50 text-center transition text-gray-700"
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 whitespace-nowrap">{l.ownerName}</td>
                      <td className="p-3 whitespace-nowrap">{l.barangay}</td>
                      <td className="p-3 whitespace-nowrap">
                        {l.healthCondition}
                      </td>
                      <td className="p-3 whitespace-nowrap">{l.status}</td>
                      <td>
                        <div className="flex justify-center space-x-1">
                          <IconButton
                            aria-label="edit"
                            onClick={() => handleView(l)}
                          >
                            <VisibilityRounded
                              sx={{ color: "#e2c018ff", fontSize: 16 }}
                            />
                          </IconButton>

                          <IconButton
                            aria-label="edit"
                            onClick={() => handleEdit(l)}
                          >
                            <EditRounded
                              sx={{ color: "#266b0f", fontSize: 16 }}
                            />
                          </IconButton>

                          <IconButton
                            aria-label="delete"
                            nClick={() => handleDelete(l)}
                          >
                            <DeleteRounded
                              sx={{ color: "#a30808", fontSize: 16 }}
                            />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={Rows.length}
                      className="text-center py-6 text-gray-500"
                    >
                      No livestock records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LivestockModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        initialData={editData}
      />
      <ViewLivestockDetailsModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        livestock={selectedLivestock}
      />
    </div>
  );
};

export default LivestockInventory;
