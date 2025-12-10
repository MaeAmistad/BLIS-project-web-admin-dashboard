import { 
  doc, setDoc, getDocs, collection, updateDoc, deleteDoc 
} from "firebase/firestore";
import { db } from "../../firebase";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";

import Header from "../../components/header";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import ViewDetailsModal from "../../components/viewdetailsModal";

import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import RaiserModal from "../../components/raisermodal";
import LivestockModal from "../../components/livestockmodal";
import HealthRecordsModal from "../../components/HealthModal";
import ConfirmationModal from "../../components/ConfirmationModal";

const RaiserProfile = () => {

  // ---------------------------------------------------------------------------
  // LIST DATA
  // ---------------------------------------------------------------------------
  const [raisers, setRaisers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // View Details Modal
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRaiser, setSelectedRaiser] = useState(null);

  // Edit Mode
  const [editData, setEditData] = useState(null); // null = Add Mode

  // ---------------------------------------------------------------------------
  // MULTI-STEP WIZARD STATE
  // ---------------------------------------------------------------------------
 // ---------------------------------------------------------------------------
// MULTI-STEP WIZARD STATE
// ---------------------------------------------------------------------------
  const [wizardStep, setWizardStep] = useState(0); 
  // 0 = closed, 1 = Raiser, 2 = Livestock, 3 = Health Records, 4 = Confirmation

  const [wizardData, setWizardData] = useState({
    raiser: {},
    livestock: [],
    healthRecords: [], // each element = array of health records per livestock
  });



  // ---------------------------------------------------------------------------
  // FETCH DATA
  // ---------------------------------------------------------------------------
  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const snapshot = await getDocs(collection(db, "raisers"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRaisers(data);
  };

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------
  const handleView = (raiser) => {
    setSelectedRaiser(raiser);
    setViewOpen(true);
  };

  const handleAdd = () => {
  setEditData(null); // Add Mode
  setWizardData({
    raiser: {},
    livestock: [],
    healthRecords: [],
  });
  setWizardStep(1);
};

const handleEdit = (raiser) => {
  setEditData(raiser); // Edit Mode
  // Fetch or prefill livestock + healthRecords if stored in Firestore
  setWizardData({
    raiser: raiser,
    livestock: raiser.livestock || [],
    healthRecords: raiser.healthRecords || [],
  });
  setWizardStep(1);
};


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

    if (!confirm.isConfirmed) return;

    await deleteDoc(doc(db, "raisers", raiser.id));
    Swal.fire("Deleted!", "Raiser has been removed.", "success");
    fetchData();
  };

  // ---------------------------------------------------------------------------
  // SAVE ALL DATA (FINAL STEP)
  // ---------------------------------------------------------------------------
  const saveAllData = async (wizardData) => {
      try {
        if (!editData) {
          // -----------------------
          // ADD MODE
          // -----------------------
          const raiserRef = doc(collection(db, "raisers"));
          await setDoc(raiserRef, wizardData.raiser);
          const raiserId = raiserRef.id;

          for (let i = 0; i < wizardData.livestock.length; i++) {
            const livestockRef = doc(collection(db, "raisers", raiserId, "livestock"));
            await setDoc(livestockRef, wizardData.livestock[i]);

            const records = wizardData.healthRecords[i] || [];
            for (let record of records) {
              const recordRef = doc(
                collection(db, "raisers", raiserId, "livestock", livestockRef.id, "healthRecords")
              );
              await setDoc(recordRef, record);
            }
          }
        } else {
          // -----------------------
          // EDIT MODE
          // -----------------------
          const raiserId = editData.id;

          // 1️⃣ Update Raiser Info
          await updateDoc(doc(db, "raisers", raiserId), wizardData.raiser);

          // 2️⃣ Fetch existing livestock
          const livestockSnap = await getDocs(collection(db, "raisers", raiserId, "livestock"));
          const existingLivestock = livestockSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          // 3️⃣ Sync livestock: update existing, add new, delete removed
          for (let i = 0; i < wizardData.livestock.length; i++) {
            const animal = wizardData.livestock[i];
            const existing = existingLivestock[i];

            let livestockId;
            if (existing) {
              // Update existing livestock
              livestockId = existing.id;
              await updateDoc(doc(db, "raisers", raiserId, "livestock", livestockId), animal);
            } else {
              // Add new livestock
              const newLivestockRef = doc(collection(db, "raisers", raiserId, "livestock"));
              await setDoc(newLivestockRef, animal);
              livestockId = newLivestockRef.id;
            }

            // Sync health records for this livestock
            const recordsRef = collection(db, "raisers", raiserId, "livestock", livestockId, "healthRecords");

            // Delete all existing records first
            const recSnap = await getDocs(recordsRef);
            for (const recDoc of recSnap.docs) {
              await deleteDoc(doc(recordsRef, recDoc.id));
            }

            // Add new records
            const records = wizardData.healthRecords[i] || [];
            for (const record of records) {
              await setDoc(doc(recordsRef), record);
            }
          }

          // 4️⃣ Delete removed livestock
          if (wizardData.livestock.length < existingLivestock.length) {
            for (let i = wizardData.livestock.length; i < existingLivestock.length; i++) {
              const toDelete = existingLivestock[i];
              await deleteDoc(doc(db, "raisers", raiserId, "livestock", toDelete.id));
            }
          }
        }

        Swal.fire("Saved!", "All data saved successfully.", "success");
        fetchData();
        setWizardStep(0);
      } catch (error) {
        console.error(error);
        Swal.fire("Error!", "Something went wrong while saving.", "error");
      }
    };




  // ---------------------------------------------------------------------------
  // FILTER LIST
  // ---------------------------------------------------------------------------
  const filteredRaisers = raisers.filter((raiser) => {
    const term = searchTerm.toLowerCase();
    const fullName = `${raiser.firstName || ""} ${raiser.middleInitial || ""} ${raiser.lastName || ""}`.toLowerCase();

    return (
      fullName.includes(term) ||
      (raiser.address?.toLowerCase() || "").includes(term) ||
      (raiser.typeOfRaiser?.toLowerCase() || "").includes(term)
    );
  });

  // ---------------------------------------------------------------------------
  // JSX
  // ---------------------------------------------------------------------------
  return (
    <div className="flex flex-col md:flex-row bg-[#F5F5F5] min-h-screen">
      <Sidebarr />
      <div className="w-full">
        <Topbar />

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 md:px-6 mt-3">
          <Header title="List of Raiser" />
        </div>

        {/* ---------------------- WIZARD MODALS --------------------------------- */}

       {/* STEP 1 — RAISER */}
        <RaiserModal
          open={wizardStep === 1}
          initialData={wizardData.raiser}
          onSave={(raiserData) => {
            setWizardData(prev => ({ ...prev, raiser: raiserData }));
            setWizardStep(2);
          }}
          onClose={() => setWizardStep(0)}
        />

        {/* STEP 2 — LIVESTOCK */}
        <LivestockModal
          open={wizardStep === 2}
          initialData={wizardData.livestock}
          onSave={(list) => {
            setWizardData(prev => {
              // Ensure healthRecords array aligns with livestock count
              const updatedHealthRecords = [...prev.healthRecords];
              while (updatedHealthRecords.length < list.length) {
                updatedHealthRecords.push([{ date: "", type: "", description: "", veterinarian: "" }]);
              }
              while (updatedHealthRecords.length > list.length) {
                updatedHealthRecords.pop();
              }

              return {
                ...prev,
                livestock: list,
                healthRecords: updatedHealthRecords,
              };
            });
            setWizardStep(3); // next step
          }}
          onPrevious={() => setWizardStep(1)}
          onClose={() => setWizardStep(0)}
        />


        {/* STEP 3 — HEALTH */}
        <HealthRecordsModal
          open={wizardStep === 3}
          livestockList={wizardData.livestock}        // tell modal how many livestock
          initialData={wizardData.healthRecords}      // array of arrays
          onSubmit={(updatedHealthRecords) => {
            setWizardData(prev => ({
              ...prev,
              healthRecords: updatedHealthRecords
            }));
            setWizardStep(4); // go to confirmation
          }}
          onPrevious={() => setWizardStep(2)}
          onClose={() => setWizardStep(0)}
        />



        {/* STEP 4 — CONFIRMATION */}
        <ConfirmationModal
          open={wizardStep === 4}
          data={wizardData}
          onClose={() => setWizardStep(3)}
          onConfirm={() => saveAllData(wizardData)}
        />



        {/* VIEW DETAILS */}
        <ViewDetailsModal 
          open={viewOpen} 
          onClose={() => setViewOpen(false)} 
          raiser={selectedRaiser} 
        />

      


        {/* CONTROLS */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4 px-4 md:px-6">
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition w-full sm:w-auto"
          >
            + Add Raiser
          </button>

          <input
            type="text"
            placeholder="Search Bar"
            className="w-full sm:max-w-xs border border-green-400 focus:ring-2 focus:ring-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="bg-white p-4 md:p-5 m-4 md:m-5 rounded-lg shadow-md overflow-x-auto">
          <table className="table-auto w-full border-collapse text-sm min-w-[900px]">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                {[
                  "Full Name",
                  "Gender",
                  "Contact No.",
                  "Barangay",
                  "Type of Raiser",
                  "No. of Livestock Owned",
                  "Registration Status",
                  "Actions",
                ].map((header, i) => (
                  <th key={i} className="p-3 font-semibold text-center whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredRaisers.length > 0 ? (
                filteredRaisers.map((raiser) => (
                  <tr key={raiser.id} className="border-b hover:bg-green-50 text-center">
                    <td className="p-3">{`${raiser.lastName}, ${raiser.firstName} ${raiser.middleInitial || ""}`}</td>
                    <td>{raiser.gender}</td>
                    <td>{raiser.contact}</td>
                    <td>{raiser.address}</td>
                    <td>{raiser.typeOfRaiser}</td>
                    <td>{raiser.farmsize}</td>
                    <td>{raiser.registrationStatus}</td>

                    <td className="p-2">
                      <div className="flex flex-col sm:flex-row justify-center gap-2">
                        <button 
                          onClick={() => handleView(raiser)}
                          className="bg-gray-200 px-3 py-1 rounded-md text-xs"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleEdit(raiser)}
                          className="bg-green-600 p-2 text-white rounded-md"
                        >
                          <EditRoundedIcon />
                        </button>
                        <button 
                          onClick={() => handleDelete(raiser)}
                          className="bg-red-600 p-2 text-white rounded-md"
                        >
                          <DeleteRoundedIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    No raisers found.
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

export default RaiserProfile;
