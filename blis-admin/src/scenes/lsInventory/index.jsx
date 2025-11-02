import { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Swal from "sweetalert2";
import Header from "../../components/header";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'; 
import EditRoundedIcon from '@mui/icons-material/EditRounded';

const LivestockInventory = () => {
  const [livestocks, setLivestocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const Rows = [
    { tableHeader: "Livestock Name" },
    { tableHeader: "Type/Breed" },
    { tableHeader: "Owner/Raiser" },
    { tableHeader: "Location" },
    { tableHeader: "Health Condition" },
    { tableHeader: "Status" },
    { tableHeader: "Actions" },
  ];

  // Fetch livestock data from Firestore
  const fetchLivestock = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "raisers"));
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

  // Delete livestock record
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

  // Search filter
  const filteredLivestock = livestocks.filter((raiser) => {
    const term = searchTerm.toLowerCase();
    return (
      (raiser.livestockName?.toLowerCase() || "").includes(term) ||
      (raiser.typeOfRaiser?.toLowerCase() || "").includes(term) ||
      (raiser.breed?.toLowerCase() || "").includes(term)
    );
  });

  return (
    <div className="flex bg-[#F5F5F5] min-h-screen">
      <Sidebarr />
      <div className="w-full">
        <Topbar />
        <div className="flex justify-between items-center">
          <Header title="Livestock Inventory" />
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4 mx-5">
          <input
            type="text"
            placeholder="Search Bar"
            className="w-full sm:max-w-sm border border-green-400 focus:ring-2 focus:ring-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table Section */}
        <div className="flex bg-white p-4 m-5 rounded-lg shadow-md overflow-x-auto">
          <div className="w-full">
            <table className="table-auto w-full border-collapse rounded-lg overflow-hidden text-sm">
              <thead className="bg-gray-100 border-b-2 border-gray-300 text-gray-700">
                <tr>
                  {Rows.map((rows, index) => (
                    <th
                      key={index}
                      className="p-3 font-semibold tracking-wide text-center whitespace-nowrap"
                    >
                      {rows.tableHeader}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLivestock.length > 0 ? (
                  filteredLivestock.map((raiser) => (
                    <tr
                      key={raiser.id}
                      className="border-b hover:bg-green-50 text-center transition text-gray-700"
                    >
                      <td className="p-3 whitespace-nowrap">{raiser.livestockName}</td>
                      <td className="p-3 whitespace-nowrap">{raiser.breed}</td>
                      <td className="p-3 font-medium whitespace-nowrap">
                        {raiser.lastName + ", " + raiser.firstName + " " + raiser.middleInitial}
                      </td>
                      <td className="p-3 whitespace-nowrap">{raiser.address}</td>
                      <td className="p-3 whitespace-nowrap">{raiser.healthCondition}</td>
                      
                      
                      <td className="p-3 whitespace-nowrap">{raiser.status}</td>
                      <td className="p-3 flex justify-center gap-2">
                        {/* View */}
                        <button
                          className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-xs font-medium transition"
                          onClick={() =>
                            Swal.fire({
                              title: "Livestock Details",
                              html: `
                                <p><b>Owner:</b> ${raiser.owner || "N/A"}</p>
                                <p><b>Type:</b> ${raiser.livestockName || "N/A"}</p>
                                <p><b>Breed:</b> ${raiser.breed || "N/A"}</p>
                                <p><b>Health:</b> ${raiser.healthCondition || "N/A"}</p>
                                <p><b>Status:</b> ${raiser.status || "N/A"}</p>
                              `,
                              confirmButtonColor: "#4CAF50",
                            })
                          }
                        >
                          View Details
                        </button>

                        {/* Edit */}
                        <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md transition">
                          <EditRoundedIcon />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(raiser)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition"
                        >
                          <DeleteRoundedIcon />
                        </button>
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
    </div>
  );
};

export default LivestockInventory;
