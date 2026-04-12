import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
  serverTimestamp,
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
  Print,
  VisibilityRounded,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import RaiserEdit from "../../components/RaiserEdit";
import RaiserView from "../../components/RaiserView";
import { useAuth } from "../../components/AuthContext";
import { notifyAllUsers } from "../../components/NotifyAllUsers";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo1 from "../../../src/assets/bantaylogo.jpg";
import logo2 from "../../../src/assets/duras.jpg";
import logo3 from "../../../src/assets/mao.jpg";
import logo4 from "../../../src/assets/pilipins.png";

const RaiserProfile = () => {
  const { user } = useAuth();

  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [raisers, setRaisers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRaiser, setSelectedRaiser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showRaiser, setShowRaiser] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [statusFilter, setStatusFilter] = useState("Active");

  const [wizardData, setWizardData] = useState({
    raiser: {},
    livestock: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setisLoading(true);
    const snapshot = await getDocs(collection(db, "raisers"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setRaisers(data);
    setisLoading(false);
  };

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

  const handleRaiserClick = (raiser) => {
    console.log("Clicked row data:", raiser);
    setShowRaiser(true);
    setSelectedRaiser(raiser);
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
      const livestockSnap = await getDocs(
        collection(db, "raisers", raiser.id, "livestock"),
      );

      for (const livestockDoc of livestockSnap.docs) {
        const healthSnap = await getDocs(
          collection(
            db,
            "raisers",
            raiser.id,
            "livestock",
            livestockDoc.id,
            "healthRecords",
          ),
        );

        for (const healthDoc of healthSnap.docs) {
          await deleteDoc(healthDoc.ref);
        }

        await deleteDoc(livestockDoc.ref);
      }

      await deleteDoc(doc(db, "raisers", raiser.id));

      await notifyAllUsers({
        title: "Raiser Profile Deleted",
        message: `Raiser ${raiser.firstName} ${raiser.lastName} and its livestock record was removed.`,
        type: "delete",
      });

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
    setWizardStep(0);
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
        ([key, value]) => key && value !== undefined && value !== "",
      ),
    );

  const saveAllData = async (wizardData) => {
    try {
      const raiserRef = doc(collection(db, "raisers"));
      await setDoc(raiserRef, cleanObject(wizardData.raiser));
      const raiserId = raiserRef.id;

      for (const animal of wizardData.livestock) {
        const livestockRef = doc(
          collection(db, "raisers", raiserId, "livestock"),
        );

        const { healthRecords = {}, ...livestockData } = animal;

        await setDoc(livestockRef, cleanObject(livestockData));

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
                  "healthRecords",
                ),
              ),
              cleanObject({
                ...record,
                type,
                createdAt: serverTimestamp(),
              }),
            );
          }
        }
      }

      const fullName = [
        wizardData.raiser?.firstName,
        wizardData.raiser?.middleInitial,
        wizardData.raiser?.lastName,
      ]
        .filter(Boolean)
        .join(" ");

      await notifyAllUsers({
        title: "New Raiser Profile",
        message: `Record for Raiser ${fullName} and its livestock records has been created`,
        type: "add",
      });

      Swal.fire({
        title: "Saved!",
        text: "Raiser added successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchData();
      resetWizard();
      window.location.reload();
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong while saving.",
        icon: "error",
      });
    }
  };

  const uniqueStatuses = [
    ...new Set(raisers.map((r) => r.registrationStatus).filter(Boolean)),
  ];

  const uniqueAddresses = [
    ...new Set(raisers.map((r) => r.address).filter(Boolean)),
  ];

  const getTimestamp = (ts) => {
    if (!ts) return 0;

    if (ts.seconds) return ts.seconds * 1000;
    return new Date(ts).getTime();
  };

  const filteredRaisers = raisers
    .filter((raiser) => {
      const term = searchTerm.toLowerCase();

      const fullName =
        `${raiser.firstName || ""} ${raiser.middleInitial || ""} ${
          raiser.lastName || ""
        }`.toLowerCase();

      const matchesSearch =
        fullName.includes(term) ||
        (raiser.address?.toLowerCase() || "").includes(term) ||
        (raiser.typeOfRaiser?.toLowerCase() || "").includes(term);

      const matchesAddress =
        selectedAddress === "" || raiser.address === selectedAddress;

      const matchesStatus =
        selectedStatus === "" || raiser.registrationStatus === selectedStatus;

      const matchesStatusToggle =
  statusFilter === "" || raiser.registrationStatus === statusFilter;

      return matchesSearch && matchesAddress && matchesStatus && matchesStatusToggle ;
    })
    .sort((a, b) => {
      const aLastActivity = Math.max(
        getTimestamp(a.createdAt),
        getTimestamp(a.updatedAt),
      );

      const bLastActivity = Math.max(
        getTimestamp(b.createdAt),
        getTimestamp(b.updatedAt),
      );

      return bLastActivity - aLastActivity;
    });

  const handlePrintRaisers = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    /*  HEADER */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);

    const centerX = pageWidth / 2;
    const headerY = 20;

    doc.text("REPUBLIC OF THE PHILIPPINES", centerX, headerY, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.text("MUNICIPALITY OF BANTAY", centerX, headerY + 5, {
      align: "center",
    });

    doc.setFontSize(8);
    doc.text("Bantay, Ilocos Sur", centerX, headerY + 10, {
      align: "center",
    });

    // --- LOGOS ---
    const imgSize = 18;
    const imgY = headerY - 8;
    const imgGap = 6;

    // Left logos
    doc.addImage(logo4, "PNG", centerX - 90, imgY, imgSize, imgSize);
    doc.addImage(
      logo1,
      "PNG",
      centerX - 90 + imgSize + imgGap,
      imgY,
      imgSize,
      imgSize,
    );

    // Right logos
    doc.addImage(
      logo3,
      "PNG",
      centerX + 90 - imgSize * 2 - imgGap,
      imgY,
      imgSize,
      imgSize,
    );
    const logo2Width = 25;
    const logo2Height = 18;
    doc.addImage(
      logo2,
      "PNG",
      centerX + 90 - logo2Width,
      imgY,
      logo2Width,
      logo2Height,
    );

    // TITLE
    doc.setFontSize(14);
    doc.text("RAISERS LIST", centerX, 42, { align: "center" });

    const tableColumn = [
      "No",
      "Full Name",
      "Email",
      "Gender",
      "Contact No.",
      "Barangay",
      "Type of Raiser",
      "Registration Status",
    ];

    const tableRows = filteredRaisers.map((raiser, index) => [
      index + 1,
      `${raiser.lastName}, ${raiser.firstName} ${raiser.middleInitial || ""}`,
      raiser.email,
      raiser.gender,
      raiser.contactNumber,
      raiser.address,
      raiser.typeOfRaiser,
      raiser.registrationStatus,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 48,
      styles: {
        fontSize: 8,
        halign: "center",
        valign: "middle",
        lineWidth: 0.3,
        lineColor: [22, 163, 74],
      },
      headStyles: {
        fillColor: [34, 139, 34],
        textColor: 255,
        fontStyle: "bold",
      },
      theme: "grid",
    });

    doc.save("raisers-list.pdf");
  };

  return (
    <div className="app flex flex-col md:flex-row">
      <Sidebarr />
      <div className="content flex-grow p-2 overflow-auto h-screen">
        <Topbar />

        {/* HEADER */}
        <div className="sticky top-14 flex flex-col md:flex-row items-start md:items-center justify-between p-1 m-2">
          <Headerr title="List of Raisers" />

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
          <div className="flex flex-col sm:flex-row gap-2 my-1 mx-1">
            {/* Address Filter */}
            <select
              className="w-full sm:max-w-xs border border-green-400 focus:ring-2 focus:ring-green-500 focus:outline-none rounded-lg px-2 py-2 text-xs text-gray-700"
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
            >
              <option value="">All</option>
              {uniqueAddresses.map((address) => (
                <option key={address} value={address}>
                  {address}
                </option>
              ))}
            </select>

            {/* Registration Status Filter */}
            <select
              className="w-full sm:max-w-xs border border-green-400 focus:ring-2 focus:ring-green-500 focus:outline-none rounded-lg px-2 py-2 text-xs text-gray-700"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search Bar"
              className="w-full sm:max-w-xs border border-green-400 focus:ring-2 focus:ring-green-500 focus:outline-none rounded-lg px-2 py-2 text-xs text-gray-700 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setStatusFilter("Active")}
                className={`px-3 py-2 text-sm rounded-lg ${
                  statusFilter === "active"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Active Raisers
              </button>

              <button
                onClick={() => setStatusFilter("Inactive")}
                className={`px-3 py-2 text-sm rounded-lg ${
                  statusFilter === "inactive"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Inactive Raisers
              </button>

              <button
                onClick={handlePrintRaisers}
                className="px-3 py-2 text-sm rounded-lg bg-black text-white flex items-center gap-1"
              >
                <Print fontSize="extra-small" />
                Print Raisers
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="relative overflow-y-auto h-[550px] mt-2 border border-gray-300 rounded-md">
            <table className="min-w-[500px] w-full text-center">
              <thead className="h-8 bg-primary uppercase sticky top-0 text-white text-sm z-10">
                <tr>
                  <th className="w-[50px]">NO</th>
                  <th className="w-[300px]">Raiser Name</th>
                  <th className="w-[200px]">Email</th>
                  <th className="w-[150px]">Gender</th>
                  <th className="w-[120px]">Contact No.</th>
                  <th className="w-[220px]">Barangay</th>
                  <th className="w-[150px]">Type of Raiser</th>
                  <th className="w-[150px]">Registration Status</th>
                  <th className="w-[80px]">Action</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      Loading Raisers List
                    </td>
                  </tr>
                ) : filteredRaisers.length > 0 ? (
                  filteredRaisers.map((raiser, index) => (
                    <tr
                      key={raiser.id}
                      className="border-b hover:bg-green-100 text-center text-xs"
                    >
                      <td className="p-2 text-center border border-gray-400">
                        {index + 1}
                      </td>
                      <td
                        className="p-2 text-center border border-gray-400 cursor-pointer"
                        onClick={() => handleRaiserClick(raiser)}
                      >{`${raiser.firstName}  ${
                        raiser.middleInitial || ""
                      } ${raiser.lastName} `}</td>
                      <td className="p-2 text-center border border-gray-400">
                        {raiser.email || "-"}
                      </td>
                      <td className="p-2 text-center border border-gray-400">
                        {raiser.gender || "-"}
                      </td>
                      <td className="p-2 text-center border border-gray-400">
                        {raiser.contactNumber || "-"}
                      </td>
                      <td className="p-2 text-center border border-gray-400">
                        {raiser.address || "-"}
                      </td>
                      <td className="p-2 text-center border border-gray-400">
                        {raiser.typeOfRaiser || "-"}
                      </td>

                      <td className="p-2 text-center border border-gray-400">
                        {raiser.registrationStatus || "-"}
                      </td>

                      <td className="p-2 text-center border border-gray-400">
                        <div className="flex justify-center">
                          <IconButton
                            aria-label="edit"
                            onClick={() => handleView(raiser)}
                          >
                            <VisibilityRounded
                              sx={{ color: "#e2c018ff", fontSize: 14 }}
                            />
                          </IconButton>

                          <IconButton
                            aria-label="edit"
                            onClick={() => handleEdit(raiser)}
                          >
                            <EditRounded
                              sx={{ color: "#266b0f", fontSize: 14 }}
                            />
                          </IconButton>

                          {isAdmin && (
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleDelete(raiser)}
                            >
                              <DeleteRounded
                                sx={{ color: "#a30808", fontSize: 16 }}
                              />
                            </IconButton>
                          )}
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
          setWizardStep(3);
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
      {showRaiser && (
        <RaiserView
          visible={showRaiser}
          onClose={() => setShowRaiser(false)}
          raiserInfo={selectedRaiser}
        />
      )}
    </div>
  );
};

export default RaiserProfile;
