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
  AddCircleOutlineRounded,
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


  // Fetch all livestock data
  const fetchRaisersWithLivestock = async () => {
    const raisersSnapshot = await getDocs(collection(db, "raisers"));

    const raisersData = await Promise.all(
      raisersSnapshot.docs.map(async (raiserDoc) => {
        const raiserData = raiserDoc.data();

        // fetch livestock subcollection
        const livestockSnapshot = await getDocs(
          collection(db, "raisers", raiserDoc.id, "livestock")
        );

        const livestockList = livestockSnapshot.docs.map(
          (doc) => doc.data().typeOfAnimal
        );

        return {
          id: raiserDoc.id,
          raiserName: `${raiserData.firstName} ${raiserData.lastName}`,
          address: raiserData.address,
          registrationStatus: raiserData.registrationStatus,
          livestockList,
          livestockCount: livestockList.length,
        };
      })
    );

    setLivestocks(raisersData); // rename if you want (e.g., setRaisers)
  };

  useEffect(() => {
    fetchRaisersWithLivestock();
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

      fetchRaisersWithLivestock();
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
      fetchRaisersWithLivestock();
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
  const filteredLivestock = livestocks.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      r.raiserName.toLowerCase().includes(term) ||
      r.address.toLowerCase().includes(term) ||
      r.livestockList.join(", ").toLowerCase().includes(term)
    );
  });

  return (
    <div className="app flex flex-col md:flex-row">
      <Sidebarr />
      <div className="content flex-grow p-2 overflow-auto h-screen">
        <Topbar />
        <div className="sticky top-14 flex flex-col md:flex-row items-start md:items-center justify-between p-1 m-2">
          <Headerr title="Livestock Information" />

          {/* <button
            // onClick={handleAdd}
            className="mt-2 md:mt-0 bg-green-600 text-white text-sm py-2 px-3 rounded-lg
                         flex items-center gap-1"
          >
            <AddCircleOutlineRounded fontSize="small" />
            Add Livestock
          </button> */}
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
                  <th className="w-[50px] text-center">NO</th>
                  <th className="w-[300px] text-center">Raiser Name</th>
                  <th className="w-[250px] text-center">Barangay</th>
                  <th className="w-[350px] text-center">List of Livestocks</th>
                  <th className="w-[350px] text-center">No of Livestocks</th>
                  <th className="w-[250px] text-center">Registration Status</th>
                  <th className="w-[150px] text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLivestock.length > 0 ? (
                  filteredLivestock.map((r, index) => (
                    <tr
                      key={r.id}
                      className="border-b hover:bg-green-50 text-gray-700"
                    >
                      <td className="p-3 text-center">{index + 1}</td>

                      <td className="p-3 text-center">{r.raiserName}</td>

                      <td className="p-3 text-center">{r.address}</td>

                      <td className="p-3 text-center">
                        {r.livestockList.length > 0 ? (
                          <ul className="inline-block text-left list-disc list-inside">
                            {r.livestockList.map((type, i) => (
                              <li key={i}>{type}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400">No Livestock</span>
                        )}
                      </td>

                      <td className="p-3 text-center">{r.livestockCount}</td>

                      <td className="p-3 text-center">{r.registrationStatus}</td>

                      <td>
                        <div className="flex justify-center space-x-1">
                          <IconButton aria-label="view details"
                           onClick={() => handleView(r)}>
                            <VisibilityRounded
                              sx={{ color: "#e2c018ff", fontSize: 16 }}
                            />
                          </IconButton>

                          <IconButton 
                          aria-label="add livestock" >
                            <AddCircleOutlineRounded
                              sx={{ color: "#220577ff", fontSize: 16 }}
                            />
                          </IconButton>

                          <IconButton aria-label="edit livestock" >
                            <EditRounded
                              sx={{ color: "#266b0f", fontSize: 16 }}
                            />
                          </IconButton>

                          <IconButton aria-label="delete livestock"
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
                    <td colSpan={7} className="text-center py-6 text-gray-500">
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
