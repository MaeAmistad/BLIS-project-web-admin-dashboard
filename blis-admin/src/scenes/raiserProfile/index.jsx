import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import ViewDetailsModal from "../../components/viewdetailsModal";
import RaiserModal from "../../components/raisermodal";
import LivestockModal from "../../components/livestockmodal";
import ConfirmationModal from "../../components/ConfirmationModal";
import Headerr from "../../components/Headerr";
import {
  AddCircleOutlineRounded,
  DeleteRounded,
  EditRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import RaiserEdit from "../../components/RaiserEdit";

const RaiserProfile = () => {
  const [raisers, setRaisers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // View Details Modal
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRaiser, setSelectedRaiser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const [wizardStep, setWizardStep] = useState(0);
  // 0 = closed, 1 = Raiser, 2 = Livestock, 3 = Health Records, 4 = Confirmation

  const [wizardData, setWizardData] = useState({
    raiser: {},
    livestock: [],
  });

  // ---------------------------------------------------------------------------
  // FETCH DATA
  // ---------------------------------------------------------------------------
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const snapshot = await getDocs(collection(db, "raisers"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
    setWizardData({
      raiser: {},
      livestock: [],
    });
    setWizardStep(1);
  };

  const handleEdit = (raiserId) => {
    setShowEdit(true);
    setSelectedRaiser(raiserId);
  };

  const handleDelete = async (raiser) => {
    const confirm = await Swal.fire({
      title: "Delete Raiser?",
      text: "This will delete the raiser, all livestock, and all health records.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      // 1️⃣ Get livestock
      const livestockSnap = await getDocs(
        collection(db, "raisers", raiser.id, "livestock")
      );

      for (const livestockDoc of livestockSnap.docs) {
        // 2️⃣ Get health records
        const healthSnap = await getDocs(
          collection(
            db,
            "raisers",
            raiser.id,
            "livestock",
            livestockDoc.id,
            "healthRecords"
          )
        );

        // 3️⃣ Delete health records
        for (const healthDoc of healthSnap.docs) {
          await deleteDoc(healthDoc.ref);
        }

        // 4️⃣ Delete livestock
        await deleteDoc(livestockDoc.ref);
      }

      // 5️⃣ Delete raiser
      await deleteDoc(doc(db, "raisers", raiser.id));

      Swal.fire({
        title: "Deleted!",
        text: "Raiser and all related data were deleted.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      fetchData();
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong while saving.",
        icon: "error",
      });
    }
  };

  const resetWizard = () => {
    setWizardData({
      raiser: {},
      livestock: [],
    });
    setWizardStep(0); // close wizard
  };

  const handleCancelWizard = () => {
    Swal.fire({
      title: "Cancel registration?",
      text: "All entered information will be permanently removed, no matter which step you are in.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, discard everything",
      cancelButtonText: "Continue editing",
      reverseButtons: true,
      focusCancel: true,
    }).then((result) => {
      if (result.isConfirmed) {
        resetWizard();
      }
    });
  };

  const cleanObject = (obj) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([key, value]) => key && value !== undefined && value !== ""
      )
    );

  const saveAllData = async (wizardData) => {
    try {
      // 1️⃣ Create raiser
      const raiserRef = doc(collection(db, "raisers"));
      await setDoc(raiserRef, cleanObject(wizardData.raiser));
      const raiserId = raiserRef.id;

      // 2️⃣ Create livestock + health records
      for (const animal of wizardData.livestock) {
        const livestockRef = doc(
          collection(db, "raisers", raiserId, "livestock")
        );

        const { healthRecords = {}, ...livestockData } = animal;

        // 1️⃣ Save livestock (WITHOUT healthRecords)
        await setDoc(livestockRef, cleanObject(livestockData));

        // 2️⃣ Save health records as subcollection
        const recordTypes = [
          { key: "vaccinations", type: "vaccination" },
          { key: "dewormings", type: "deworming" },
          { key: "treatments", type: "treatment" },
          { key: "aiRecords", type: "ai" },
        ];

        for (const { key, type } of recordTypes) {
          const records = healthRecords[key] || [];

          for (const record of records) {
            await setDoc(
              doc(
                collection(
                  db,
                  "raisers",
                  raiserId,
                  "livestock",
                  livestockRef.id,
                  "healthRecords"
                )
              ),
              cleanObject({
                ...record,
                type,
                createdAt: new Date(),
              })
            );
          }
        }
      }

      Swal.fire({
        title: "Saved!",
        text: "Raiser added successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchData();
      resetWizard();
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong while saving.",
        icon: "error",
      });
    }
  };

  const filteredRaisers = raisers.filter((raiser) => {
    const term = searchTerm.toLowerCase();
    const fullName = `${raiser.firstName || ""} ${raiser.middleInitial || ""} ${
      raiser.lastName || ""
    }`.toLowerCase();

    return (
      fullName.includes(term) ||
      (raiser.address?.toLowerCase() || "").includes(term) ||
      (raiser.typeOfRaiser?.toLowerCase() || "").includes(term)
    );
  });

  return (
    <div className="app flex flex-col md:flex-row">
      <Sidebarr />
      <div className="content flex-grow p-2 overflow-auto h-screen">
        <Topbar />

        {/* HEADER */}
        <div className="sticky top-14 flex flex-col md:flex-row items-start md:items-center justify-between p-1 m-2">
          <Headerr title="List of Raiser" />

          <button
            onClick={handleAdd}
            className="mt-2 md:mt-0 bg-green-600 text-white text-sm py-2 px-3 rounded-lg
               flex items-center gap-1"
          >
            <AddCircleOutlineRounded fontSize="small" />
            Add Raiser
          </button>
        </div>

        {/* MAIN BODY */}
        <div className="m-1 mt-1 flex-grow overflow-y-auto bg-white-main shadow-md rounded-md">
          {/* SEARCH FILTERINGS */}
          <div className="p-1">
            <div>
              <div className="flex my-1 mx-1 space-x-1">
                <input
                  type="text"
                  placeholder="Search Bar"
                  className="w-full sm:max-w-xs border border-green-400 focus:ring-2 focus:ring-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                  <th className="w-[350px]">Full Name</th>
                  <th className="w-[150px]">Email</th>
                  <th className="w-[150px]">Gender</th>
                  <th className="w-[120px]">Contact No.</th>
                  <th className="w-[220px]">Address</th>
                  <th className="w-[150px]">Type of Raiser</th>
                  <th className="w-[150px]">Registration Status</th>
                  <th className="w-[150px]">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredRaisers.length > 0 ? (
                  filteredRaisers.map((raiser, index) => (
                    <tr
                      key={raiser.id}
                      className="border-b hover:bg-green-50 text-center"
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{`${raiser.lastName}, ${
                        raiser.firstName
                      } ${raiser.middleInitial || ""}`}</td>
                      <td>{raiser.email}</td>
                      <td>{raiser.gender}</td>
                      <td>{raiser.contactNumber}</td>
                      <td>{raiser.address}</td>
                      <td>{raiser.typeOfRaiser}</td>

                      <td>{raiser.registrationStatus}</td>

                      <td>
                        <div className="flex justify-center space-x-1">
                          <IconButton
                            aria-label="edit"
                            onClick={() => handleView(raiser)}
                          >
                            <VisibilityRounded
                              sx={{ color: "#e2c018ff", fontSize: 16 }}
                            />
                          </IconButton>

                          <IconButton
                            aria-label="edit"
                            onClick={() => handleEdit(raiser)}
                          >
                            <EditRounded
                              sx={{ color: "#266b0f", fontSize: 16 }}
                            />
                          </IconButton>

                          <IconButton
                            aria-label="delete"
                            onClick={() => handleDelete(raiser)}
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

      {/* STEP 1 — RAISER */}
      <RaiserModal
        open={wizardStep === 1}
        onSave={(raiserData) => {
          setWizardData((prev) => ({ ...prev, raiser: raiserData }));
          setWizardStep(2);
        }}
        onClose={() => setWizardStep(0)}
        onCancel={handleCancelWizard}
      />

      {/* STEP 2 — LIVESTOCK */}
      <LivestockModal
        open={wizardStep === 2}
        initialData={wizardData.livestock}
        onSave={(list) => {
          setWizardData((prev) => ({
            ...prev,
            livestock: list,
          }));
          setWizardStep(3); // 👈 straight to confirmation
        }}
        onPrevious={() => setWizardStep(1)}
        onClose={() => setWizardStep(0)}
        onCancel={handleCancelWizard}
      />

      {/* STEP 3 — CONFIRMATION */}
      <ConfirmationModal
        open={wizardStep === 3}
        data={wizardData}
        onClose={() => setWizardStep(2)}
        onConfirm={() => saveAllData(wizardData)}
        onCancel={handleCancelWizard}
      />

      {/* VIEW DETAILS */}
      <ViewDetailsModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        raiser={selectedRaiser}
      />

      {showEdit && (
        <RaiserEdit
          open={showEdit}
          onClose={() => setShowEdit(false)}
          raiserData={selectedRaiser}
        />
      )}
    </div>
  );
};

export default RaiserProfile;
