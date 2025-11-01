import { doc, setDoc, getDocs, collection, updateDoc, deleteDoc  } from "firebase/firestore";
import { db } from "../../firebase"; 
import { Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Header from "../../components/header";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import RaiserModal from "../../components/raisermodal";
import ViewDetailsModal from "../../components/viewdetailsModal";


const RaiserProfile = () => { 
  const [raisers, setRaisers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRaiser, setSelectedRaiser] = useState(null);

  // MODAL
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
    //Capitalize all string values before saving
    const capitalizedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        typeof value === "string" ? value.toUpperCase() : value,
      ])
    );

    if (editData) {
      // UPDATE existing record
      const docRef = doc(db, "raisers", editData.id);
      await updateDoc(docRef, capitalizedData);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Raiser information has been updated successfully.",
        confirmButtonColor: "#4CAF50",
      });
    } else {
      //ADD new record
      const docRef = doc(collection(db, "raisers"));
      await setDoc(docRef, capitalizedData);

      Swal.fire({
        icon: "success",
        title: "Raiser Added!",
        text: "The new raiser has been added successfully.",
        confirmButtonColor: "#4CAF50",
      });
    }

    //Refresh table
    fetchData();
    setOpen(false);
  } catch (error) {
    console.error("Error saving raiser:", error);
    Swal.fire({
      icon: "error",
      title: "Save Failed",
      text: "Something went wrong while saving. Please try again.",
      confirmButtonColor: "#d33",
    });
  }
};

// Table Header
  const Rows = [
    { tableHeader: "Full Name" },
    { tableHeader: "Gender" },
    { tableHeader: "Contact No." },
    { tableHeader: "Barangay" },
    { tableHeader: "Type of Raiser" },
    { tableHeader: "Date Registered" },
    { tableHeader: "No. of Livestock Owned" },
    { tableHeader: "Registration Status" },
    { tableHeader: "Actions" },
  ];

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "raisers"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRaisers(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  //Delete Data
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

  //Search Bar
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
        <RaiserModal
          open={open}
          onClose={() => setOpen(false)}
          onSave={handleSave}
          initialData={editData}
        />
      <ViewDetailsModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        raiser={selectedRaiser}
      />
        <div>
          <Button
            variant="contained"
            size="medium"
            sx={{
              mt:2,
              ml:3,
              pl:4,
              pr:4,
              backgroundColor: " #4CAF50",
              "&:hover": { backgroundColor: " #68ca6bff" },
            }}
            onClick={handleAdd}>
            Add Raiser
          </Button>
        </div>
        <div className="flex bg-white p-4 m-5 rounded-lg shadow-md"> 
          {/* SEARCH */}
          <div className="w-full overflow-x-auto">
            <div className="flex justify-between items-center mb-3 mt-2">
              <TextField
                label="Search by Name, Barangay or Type of Raiser"
                variant="outlined"
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#4CAF50",
                    },
                    "&:hover fieldset": {
                      borderColor: "#388E3C",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2E7D32",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#4d504dff",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#2E7D32",
                  },
                }}
              />
            </div>

            <table className="table-auto w-full border-collapse rounded-lg overflow-hidden">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
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
                {filteredRaisers.length > 0 ? (
                  filteredRaisers.map((raiser, index) => (
                    <tr
                      key={raiser.id}
                      className="border-b hover:bg-green-50 text-center transition-all"
                    >
                      <td className="p-3 font-medium">{raiser.lastName + ", " + raiser.firstName + " " + raiser.middleInitial}</td>
                      <td className="p-3">{raiser.gender}</td>
                      <td className="p-3">{raiser.contact}</td>
                      <td className="p-3">{raiser.address}</td>
                      <td className="p-3">{raiser.typeOfRaiser}</td>
                      <td className="p-3">{raiser.createdAt}</td>
                      <td className="p-3">{raiser.farmsize}</td>
                      <td className="p-3">{raiser.registrationStatus}</td>
                      <td className="p-3 flex justify-center gap-2">
                        <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleView(raiser)}
                      >
                        View Details
                      </Button>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: " #4CAF50",
                            "&:hover": { backgroundColor: " #68ca6bff" },
                            minWidth: "32px",
                            padding: "4px", 
                          }}
                          onClick={() => handleEdit1(raiser)}
                        >
                          <EditRoundedIcon/>
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          sx={{
                            minWidth: "32px",
                            padding: "4px", 
                          }}
                          onClick={() => handleDelete(raiser)}
                        >
                          <DeleteRoundedIcon/>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={Rows.length}
                      className="text-center py-6 text-gray-500"
                    >
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
