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
import LivestockViewInfo from "../../components/LivestockViewInfo";
import { IconButton } from "@mui/material";
import {
  AddCircleOutlineRounded,
  DeleteRounded,
  EditRounded,
  Print,
  VisibilityRounded,
} from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo1 from "../../../src/assets/bantaylogo.jpg";
import logo2 from "../../../src/assets/duras.jpg";
import logo3 from "../../../src/assets/mao.jpg";
import logo4 from "../../../src/assets/pilipins.png";

const LivestockInventory = () => {
  const [livestocks, setLivestocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedLivestock, setSelectedLivestock] = useState(null);
  const [editData, setEditData] = useState(null);
  const [selectedRaiser, setSelectedRaiser] = useState(null);
  const [showRaiser, setShowRaiser] = useState(false);

  // Fetch all livestock data
  const fetchRaisersWithLivestock = async () => {
    const raisersSnapshot = await getDocs(collection(db, "raisers"));

    const raisersData = await Promise.all(
      raisersSnapshot.docs.map(async (raiserDoc) => {
        const raiserData = raiserDoc.data();

        const livestockSnapshot = await getDocs(
          collection(db, "raisers", raiserDoc.id, "livestock"),
        );

        const livestockList = (
          await Promise.all(
            livestockSnapshot.docs.map(async (livestockDoc) => {
              const livestockData = livestockDoc.data();

              if (!livestockData.typeOfAnimal) return null;

              const healthRecordsSnapshot = await getDocs(
                collection(
                  db,
                  "raisers",
                  raiserDoc.id,
                  "livestock",
                  livestockDoc.id,
                  "healthRecords",
                ),
              );

              return {
                id: livestockDoc.id,
                raiserId: raiserDoc.id,
                ...livestockData,
                healthRecordsCount: healthRecordsSnapshot.size,
              };
            }),
          )
        ).filter(Boolean);

        return {
          id: raiserDoc.id,
          raiserName: `${raiserData.firstName} ${raiserData.lastName}`,
          address: raiserData.address,
          contactNumber: raiserData.contactNumber,
          typeOfRaiser: raiserData.typeOfRaiser,
          farmName: raiserData.farmName,
          farmLocation: raiserData.farmLocation,
          livestockList,
          livestockCount: livestockList.length,
          registrationStatus: raiserData.registrationStatus,
        };
      }),
    );

    setLivestocks(raisersData);
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
          "success",
        );
      } else {
        const newDoc = doc(collection(db, "livestock"));
        await setDoc(newDoc, data);
        Swal.fire(
          "Added!",
          "New livestock record added successfully.",
          "success",
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

    if (!confirm.isConfirmed) return;

    try {
      const { raiserId, id: livestockId } = livestock;

      // Delete healthRecords first
      const healthRecordsRef = collection(
        db,
        "raisers",
        raiserId,
        "livestock",
        livestockId,
        "healthRecords",
      );

      const healthRecordsSnap = await getDocs(healthRecordsRef);

      const deletePromises = healthRecordsSnap.docs.map((docSnap) =>
        deleteDoc(docSnap.ref),
      );

      await Promise.all(deletePromises);

      // Delete livestock document
      await deleteDoc(doc(db, "raisers", raiserId, "livestock", livestockId));

      Swal.fire("Deleted!", "Livestock has been removed.", "success");
      fetchRaisersWithLivestock();
    } catch (error) {
      console.error("Delete failed:", error);
      Swal.fire("Error", "Failed to delete livestock.", "error");
    }
  };

  // View livestock details
  const handleView = (livestock) => {
    setSelectedLivestock(livestock);
    setViewOpen(true);
  };

  const handleRaiserClick = (raiser) => {
    console.log("Clicked row data:", raiser);
    setShowRaiser(true);
    setSelectedRaiser(raiser);
  };

  const handleEdit = (livestock) => {
    setEditData(livestock);
    setOpen(true);
  };

  // Search filter
  const filteredLivestock = livestocks.filter((r) => {
    const term = searchTerm.toLowerCase();

    const animals = r.livestockList
      .filter((l) => l.typeOfAnimal)
      .map((l) => l.typeOfAnimal)
      .join(" ")
      .toLowerCase();

    return (
      r.raiserName?.toLowerCase().includes(term) ||
      r.address?.toLowerCase().includes(term) ||
      animals.includes(term)
    );
  });

  const handlePrintLivestocks = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;

    /* ================= HEADER ================= */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("REPUBLIC OF THE PHILIPPINES", centerX, 20, { align: "center" });

    doc.setFontSize(10);
    doc.text("MUNICIPALITY OF BANTAY", centerX, 25, { align: "center" });

    doc.setFontSize(8);
    doc.text("Bantay, Ilocos Sur", centerX, 30, { align: "center" });

    // --- LOGOS ---
    const imgSize = 18;
    const imgY = 12;
    const imgGap = 6;

    doc.addImage(logo4, "PNG", centerX - 90, imgY, imgSize, imgSize);
    doc.addImage(
      logo1,
      "PNG",
      centerX - 90 + imgSize + imgGap,
      imgY,
      imgSize,
      imgSize,
    );

    doc.addImage(
      logo3,
      "PNG",
      centerX + 90 - imgSize * 2 - imgGap,
      imgY,
      imgSize,
      imgSize,
    );
    doc.addImage(logo2, "PNG", centerX + 90 - imgSize, imgY, imgSize, imgSize);

    // TITLE
    doc.setFontSize(14);
    doc.text("LIVESTOCK INFORMATION", centerX, 42, { align: "center" });

    /* ================= TABLE ================= */
    autoTable(doc, {
      startY: 48,
      theme: "grid",
      head: [
        [
          "No",
          "Raiser Name",
          "Barangay",
          "List of Livestocks",
          "No. of Livestocks",
          "Registration Status",
        ],
      ],
      body: filteredLivestock.map((r, index) => [
        index + 1,
        r.raiserName,
        r.address,
        r.livestockList.length > 0
          ? r.livestockList.map((l) => l.typeOfAnimal).join(", ")
          : "No Livestock",
        r.livestockCount,
        r.registrationStatus,
      ]),
      styles: {
        fontSize: 8,
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: [34, 139, 34],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 45 },
        2: { cellWidth: 35 },
        3: { cellWidth: 85 },
        4: { cellWidth: 30 },
        5: { cellWidth: 40 },
      },
    });

    doc.save("livestock-information.pdf");
  };

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
          <div className="p-1 flex items-center">
            <div className="flex my-1 mx-1 space-x-1">
              <input
                type="text"
                placeholder="Search"
                className="w-full sm:max-w-sm border border-green-400 focus:ring-2 focus:ring-green-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-gray-700 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={handlePrintLivestocks}
              className="ml-auto px-3 py-1.5 text-xs rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-no-drop flex items-center gap-1"
            >
              <Print fontSize="extra-small" />
              Print Livestocks
            </button>
          </div>

          {/* Table */}
          <div className="relative overflow-y-auto h-[550px] border border-gray-300 mt-2 rounded-md">
            <table cclassName="min-w-[500px] w-full text-center">
              <thead className="h-8 bg-primary uppercase sticky top-0 text-white text-sm">
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
                      className="border hover:bg-green-100 text-gray-700 text-xs"
                    >
                      <td className="p-2 text-center border border-gray-400">
                        {index + 1}
                      </td>

                      <td
                        className="p-2 text-center border border-gray-400 cursor-pointer"
                        onClick={() => handleRaiserClick(r)}
                      >
                        {r.raiserName}
                      </td>

                      <td className="p-2 text-center border border-gray-400">
                        {r.address}
                      </td>

                      <td className="p-2 text-center border border-gray-400">
                        {r.livestockList.length > 0 ? (
                          <span
                            className="text-gray-700"
                            title={r.livestockList
                              .map((l) => l.typeOfAnimal || l.animalType || "")
                              .filter(Boolean)
                              .join(", ")}
                          >
                            {r.livestockList
                              .map((l) => l.typeOfAnimal || l.animalType || "")
                              .filter(Boolean)
                              .slice(0, 3)
                              .join(", ")}
                            {r.livestockList.length > 3 && "…"}
                          </span>
                        ) : (
                          <span className="text-gray-400">No Livestock</span>
                        )}
                      </td>

                      <td className="p-2 text-center border border-gray-400">
                        {r.livestockCount}
                      </td>

                      <td className="p-2 text-center border border-gray-400">
                        {r.registrationStatus}
                      </td>

                      <td className="text-center border border-gray-400">
                        <div className="flex justify-center">
                          <IconButton
                            aria-label="view details"
                            onClick={() => handleView(r)}
                          >
                            <VisibilityRounded
                              sx={{ color: "#e2c018ff", fontSize: 16 }}
                            />
                          </IconButton>

                          <IconButton aria-label="add livestock">
                            <AddCircleOutlineRounded
                              sx={{ color: "#220577ff", fontSize: 16 }}
                            />
                          </IconButton>

                          {/* <IconButton aria-label="edit livestock">
                            <EditRounded
                              sx={{ color: "#266b0f", fontSize: 16 }}
                            />
                          </IconButton> */}

                          {/* <IconButton
                            aria-label="delete livestock"
                            //  onClick={() => handleDelete(r)}
                          >
                            <DeleteRounded
                              sx={{ color: "#a30808", fontSize: 16 }}
                            />
                          </IconButton> */}
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
        raiser={selectedLivestock}
      />
      {showRaiser && (
        <LivestockViewInfo
          visible={showRaiser}
          onClose={() => setShowRaiser(false)}
          raiserInfo={selectedRaiser}
        />
      )}
    </div>
  );
};

export default LivestockInventory;
