import { doc, setDoc, getDocs, collection, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Header from "../../components/header";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import RaiserModal from "../../components/raisermodal";
import ViewDetailsModal from "../../components/viewdetailsModal";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'; 
import EditRoundedIcon from '@mui/icons-material/EditRounded';

const RaiserProfile = () => {
  const [raisers, setRaisers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRaiser, setSelectedRaiser] = useState(null);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleView = (raiser) => {
    setSelectedRaiser(raiser);
    setViewOpen(true);
  };

  const handleAdd = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleEdit1 = (raiser) => {
    setEditData(raiser);
    setOpen(true);
  };

  const handleSave = async (data) => {
    try {
      const capitalizedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, typeof value === "string" ? value : value])
      );

      if (editData) {
        const docRef = doc(db, "raisers", editData.id);
        await updateDoc(docRef, capitalizedData);
        Swal.fire("Updated!", "Raiser information updated successfully.", "success");
      } else {
        const docRef = doc(collection(db, "raisers"));
        await setDoc(docRef, capitalizedData);
        Swal.fire("Raiser Added!", "New raiser added successfully.", "success");
      }

      fetchData();
      setOpen(false);
    } catch (error) {
      console.error("Error saving raiser:", error);
      Swal.fire("Error!", "Something went wrong while saving.", "error");
    }
  };

  const Rows = [
    { tableHeader: "Full Name" },
    { tableHeader: "Gender" },
    { tableHeader: "Contact No." },
    { tableHeader: "Barangay" },
    { tableHeader: "Type of Raiser" },
    { tableHeader: "No. of Livestock Owned" },
    { tableHeader: "Registration Status" },
    { tableHeader: "Actions" },
  ];

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "raisers"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setRaisers(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (raiser) => {
    const confirm = await Swal.fire({
      title: "Delete Raiser?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    });

    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "raisers", raiser.id));
      Swal.fire("Deleted!", "Raiser has been removed.", "success");
      fetchData();
    }
  };

  const filteredRaisers = raisers.filter((raiser) => {
    const term = searchTerm.toLowerCase();
    const fullName = `${raiser.firstName || ""} ${raiser.middleInitial || ""} ${raiser.lastName || ""}`.toLowerCase();

    return (
      fullName.includes(term) ||
      (raiser.address?.toLowerCase() || "").includes(term) ||
      (raiser.typeOfRaiser?.toLowerCase() || "").includes(term)
    );
  });

  return (
    <div className="flex bg-[#F5F5F5] min-h-screen">
      <Sidebarr />
      <div className="w-full">
        <Topbar />
        <div className="flex justify-between items-center">
          <Header title="List of Raiser" />
        </div>

        {/* Modals */}
        <RaiserModal open={open} onClose={() => setOpen(false)} onSave={handleSave} initialData={editData} />
        <ViewDetailsModal open={viewOpen} onClose={() => setViewOpen(false)} raiser={selectedRaiser} />

        {/* Controls (Add + Search) */}
        <div className="flex flex-col items-start gap-3 mt-4 mx-5">
        {/* Add Raiser Button */}
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition w-full sm:w-auto"
        >
          + Add Raiser
        </button>

        {/* Search Bar */}
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
                    <th key={index} className="p-3 font-semibold tracking-wide text-center whitespace-nowrap">
                      {rows.tableHeader}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRaisers.length > 0 ? (
                  filteredRaisers.map((raiser) => (
                    <tr
                      key={raiser.id}
                      className="border-b hover:bg-green-50 text-center transition text-gray-700"
                    >
                      <td className="p-3 font-medium whitespace-nowrap">
                        {raiser.lastName + ", " + raiser.firstName + " " + raiser.middleInitial}
                      </td>
                      <td className="p-3 whitespace-nowrap">{raiser.gender}</td>
                      <td className="p-3 whitespace-nowrap">{raiser.contact}</td>
                      <td className="p-3 whitespace-nowrap">{raiser.address}</td>
                      <td className="p-3 whitespace-nowrap">{raiser.typeOfRaiser}</td>
                      <td className="p-3 whitespace-nowrap">{raiser.farmsize}</td>
                      <td className="p-3 whitespace-nowrap">{raiser.registrationStatus}</td>
                      <td className="p-3 flex justify-center gap-2">
                        {/* View */}
                        <button
                          onClick={() => handleView(raiser)}
                          className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-xs font-medium transition"
                        >
                          View Details
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleEdit1(raiser)}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md transition"
                        >
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
                    <td colSpan={Rows.length} className="text-center py-6 text-gray-500">
                      No raisers found.
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

export default RaiserProfile;
