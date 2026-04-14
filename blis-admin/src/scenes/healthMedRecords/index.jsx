import React, { useEffect, useMemo, useState } from "react";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import HealingIcon from "@mui/icons-material/Healing";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import MedicationIcon from "@mui/icons-material/Medication";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import BiotechIcon from "@mui/icons-material/Biotech";
import MedicationLiquidRoundedIcon from "@mui/icons-material/MedicationLiquidRounded";
import Headerr from "../../components/Headerr";
import {
  collection,
  getDocs,
  collectionGroup,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo1 from "../../../src/assets/bantaylogo.jpg";
import logo2 from "../../../src/assets/duras.jpg";
import logo3 from "../../../src/assets/mao.jpg";
import logo4 from "../../../src/assets/pilipins.png";
import { DeleteRounded } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Swal from "sweetalert2";
import { notifyAllUsers } from "../../components/NotifyAllUsers";
import { useAuth } from "../../components/AuthContext";

const recordTypeFormatter = (value) => {
  if (!value) return "—";

  const normalized = value.toLowerCase();

  if (normalized === "ai") return "Artificial Insemination";

  return normalized
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const tableColumns = {
  healthList: [
    { label: "Raiser Name", key: "raiserName" },
    { label: "Barangay", key: "address" },
    { label: "Livestock Type", key: "typeOfAnimal" },
    { label: "Health Condition", key: "healthCondition" },
    {
      label: "Record Type",
      key: "recordType",
      format: recordTypeFormatter,
    },
  ],

  vaccination: [
    { label: "Name of Owner", key: "raiserName" },
    { label: "Contact No", key: "contactNumber" },
    { label: "Species", key: "typeOfAnimal" },
    { label: "Pet Name", key: "livestockName" },
    { label: "Age", key: "age" },
    { label: "Vaccine Used", key: "vaccine" },
    { label: "Date", key: "date" },
    { label: "Vitamins", key: "vitamins" },
    { label: "Vitamins Date", key: "dateVitamins" },
    { label: "Remarks", key: "remarks" },
  ],

  deworming: [
    { label: "Dewormer", key: "dewormer" },
    { label: "Date Administered", key: "dateAdministered" },
    { label: "Next Schedule", key: "nextSchedule" },
    { label: "Administered By", key: "administeredBy" },
    { label: "Dosage", key: "dosage" },
    { label: "Remarks", key: "remarks" },
  ],

  treatment: [
    { label: "Illness", key: "illness" },
    { label: "Medication", key: "medication" },
    { label: "Date Started", key: "dateStarted" },
    { label: "Date Completed", key: "dateCompleted" },
    { label: "Administered By", key: "administeredBy" },
    { label: "Dosage Frequency", key: "dosageFrequency" },
    { label: "Result", key: "result" },
    { label: "Remarks", key: "remarks" },
  ],

  ai: [
    { label: "Animal Type", key: "animalType" },
    { label: "Date of Insemination", key: "date" },
    { label: "Semen Type", key: "semenType" },
    { label: "Specialist", key: "specialist" },
    { label: "Status", key: "status" },
    { label: "Re-heat Monitoring", key: "calvingDate" },
    { label: "Expected Delivery", key: "expectedDelivery" },
    { label: "Remarks", key: "remarks" },
  ],
  unvaccinated: [
    { label: "Name of Owner", key: "raiserName" },
    { label: "Contact No", key: "contactNumber" },
    { label: "No of Dogs", key: "dogCount" },
    { label: "No of Cats", key: "catCount" },

    { label: "Awan Tao", key: "reasonAwanTao" },
    { label: "Below 3 Months", key: "reasonBelow3Months" },
    { label: "Pregnant", key: "reasonPregnant" },

    { label: "Remarks", key: "remarks" },
  ],
};

const HealthandMedical = () => {
  const [activeTable, setActiveTable] = useState("healthList");
  const [raisers, setRaisers] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [livestock, setLivestock] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  
    const isAdmin = user?.role?.toLowerCase() === "admin";

  useEffect(() => {
    const fetchAllHealthRecords = async () => {
      setIsLoading(true);
      const snap = await getDocs(collectionGroup(db, "healthRecords"));

      const records = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        livestockId: doc.ref.parent.parent.id,
        raiserId: doc.ref.parent.parent.parent.parent.id,
      }));

      setHealthRecords(records);
    };

    fetchAllHealthRecords();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const fetchRaisers = async () => {
      const snap = await getDocs(collection(db, "raisers"));
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRaisers(data);
    };

    fetchRaisers();
  }, []);

  useEffect(() => {
    const fetchLivestock = async () => {
      const snap = await getDocs(collectionGroup(db, "livestock"));
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        raiserId: doc.ref.parent.parent.id,
      }));
      setLivestock(data);
    };

    fetchLivestock();
  }, []);

  useEffect(() => {
    setSearchTerm("");
  }, [activeTable]);

  const normalizeAnimal = (typeOfAnimal = "") => {
    const t = typeOfAnimal.toLowerCase();
    if (t === "dog" || t === "dogs") return "dog";
    if (t === "cat" || t === "cats") return "cat";
    return null;
  };

  const unvaccinatedRecords = useMemo(() => {
    if (!raisers?.length) return [];

    const map = {};

    raisers.forEach((raiser) => {
      const raiserId = raiser.id;
      const livestockList = raiser.livestock || [];

      livestockList.forEach((animal) => {
        const animalType = normalizeAnimal(animal.typeOfAnimal);
        if (!animalType) return;

        const healthRecords = animal.healthRecords || [];
        healthRecords.forEach((record) => {
          if (record.type === "vaccination" || record.type === "vaccinations")
            return;

          if (!map[raiserId]) {
            map[raiserId] = {
              id: raiserId,
              raiserName:
                `${raiser.firstName || "—"} ${raiser.lastName || ""}`.trim(),
              contactNumber: raiser.contactNumber || "—",

              dogCount: 0,
              catCount: 0,

              reasonAwanTao: 0,
              reasonBelow3Months: 0,
              reasonPregnant: 0,

              remarks: "",
            };
          }

          if (animalType === "dog") map[raiserId].dogCount += 1;
          if (animalType === "cat") map[raiserId].catCount += 1;

          map[raiserId].remarks = record.remarks || map[raiserId].remarks;
        });
      });
    });

    return Object.values(map);
  }, [raisers]);

  const joinedRecords = useMemo(() => {
    if (!healthRecords.length || !livestock.length || !raisers.length)
      return [];

    return healthRecords.map((record) => {
      const animal = livestock.find((l) => l.id === record.livestockId);
      const raiser = raisers.find((r) => r.id === record.raiserId);

      return {
        id: record.id,
        recordType: record.type,
        recordData: record,

        raiserName: raiser
          ? `${raiser.firstName} ${raiser.middleInitial} ${raiser.lastName}`
          : "—",
        address: raiser?.address || "—",
        contactNumber: raiser?.contactNumber || "—",

        typeOfAnimal: animal?.typeOfAnimal || "—",
        livestockName: animal?.livestockName || "-",
        age: animal?.age || "-",
        healthCondition: animal?.healthCondition || "—",
      };
    });
  }, [healthRecords, livestock, raisers]);

  const displayedRecords = useMemo(() => {
    if (activeTable === "unvaccinated") {
      return unvaccinatedRecords;
    }

    let data =
      activeTable === "healthList"
        ? joinedRecords
        : joinedRecords.filter((r) => r.recordType === activeTable);

    if (!searchTerm.trim()) return data;

    const term = searchTerm.toLowerCase();

    return data.filter((row) =>
      Object.values(row).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(term),
      ),
    );
  }, [activeTable, joinedRecords, unvaccinatedRecords, searchTerm]);


const handleDeleteHealthRecord = async (record) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This record will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      // Reference to the livestock document
      const livestockDocRef = doc(db, "raisers", record.raiserId, "livestock", record.livestockId);
      const livestockSnap = await getDoc(livestockDocRef);

      let livestockData = {};
      if (livestockSnap.exists()) {
        livestockData = livestockSnap.data();
      }

      // Delete the health record
      const healthDocRef = doc(
        db,
        "raisers",
        record.raiserId,
        "livestock",
        record.livestockId,
        "healthRecords",
        record.id
      );
      await deleteDoc(healthDocRef);

      // Update local state
      setHealthRecords((prev) => prev.filter((r) => r.id !== record.id));

      // Notify all users
      await notifyAllUsers({
        title: "Health and Medical Record Deleted",
        message: `Record for ${livestockData.typeOfAnimal || "Livestock"} ${livestockData.livestockName || ""} was deleted.`,
        type: "delete",
      });

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The record has been deleted.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting health record:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to delete record.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  }
};

  const handleButtonClick = (tableName) => {
    setActiveTable(tableName);
  };

  const addReportHeader = (doc, title) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;
    const headerY = 20;

    /* TEXT HEADER  */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
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

    /* LOGOS */
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

    const logo2Width = 25;
    const logo2Height = 18;

    // Right logos
    doc.addImage(
      logo3,
      "PNG",
      centerX + 90 - imgSize * 2 - imgGap,
      imgY,
      imgSize,
      imgSize,
    );
    doc.addImage(
      logo2,
      "PNG",
      centerX + 90 - logo2Width,
      imgY,
      logo2Width,
      logo2Height,
    );

    /* REPORT TITLE */
    doc.setFontSize(14);
    doc.text(title, centerX, 42, { align: "center" });

    /*DATE */
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 48);

    return 52;
  };

  const handleExportPDF = () => {
    if (!displayedRecords.length) return;

    const doc = new jsPDF({ orientation: "landscape" });

    const titleMap = {
      healthList: "Livestock Health List",
      vaccination: "Vaccination Records",
      deworming: "Deworming Records",
      treatment: "Treatment Records",
      ai: "Artificial Insemination Records",
    };

    const startY = addReportHeader(doc, titleMap[activeTable]);
    const columns = tableColumns[activeTable].map((col) => col.label);

    const rows = displayedRecords.map((row) =>
      tableColumns[activeTable].map((col) =>
        activeTable === "healthList"
          ? (row[col.key] ?? "—")
          : (row.recordData[col.key] ?? "—"),
      ),
    );

    autoTable(doc, {
      startY,
      head: [columns],
      body: rows,
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineWidth: 0.3,
        lineColor: [22, 163, 74],
      },
      headStyles: {
        fillColor: [22, 163, 74],
      },
    });

    doc.save(`${activeTable}-report.pdf`);
  };

  const handleExportVaccinationPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    /*  HEADER  */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);

    const centerX = pageWidth / 2;
    const headerY = 20;

    doc.text("REPUBLIC OF THE PHILIPPINES", centerX, headerY, {
      align: "center",
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("MUNICIPALITY OF BANTAY", centerX, headerY + 5, {
      align: "center",
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("Bantay, Ilocos Sur", centerX, headerY + 10, {
      align: "center",
    });

    // --- IMAGES ---
    const imgSize = 18;
    const imgY = headerY - 8;
    const imgGap = 6;

    // Left side logos
    doc.addImage(logo4, "PNG", centerX - 90, imgY, imgSize, imgSize);
    doc.addImage(
      logo1,
      "PNG",
      centerX - 90 + imgSize + imgGap,
      imgY,
      imgSize,
      imgSize,
    );

    // Right side logos
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

    // Right logos
    doc.addImage(
      logo3,
      "PNG",
      centerX + 90 - imgSize * 2 - imgGap,
      imgY,
      imgSize,
      imgSize,
    );
    doc.addImage(
      logo2,
      "PNG",
      centerX + 90 - logo2Width,
      imgY,
      logo2Width,
      logo2Height,
    );

    doc.setFontSize(14);
    doc.text("VACCINATION REPORT", pageWidth / 2, 42, { align: "center" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const infoStartY = 45;

    doc.text("Province: ________________________", 14, infoStartY);
    doc.text("Municipality: ____________________", 14, infoStartY + 5);
    doc.text("Barangay: ________________________", 14, infoStartY + 10);

    doc.text(
      "Livestock Inspector: ____________________",
      pageWidth - 90,
      infoStartY,
    );
    doc.text("Date: ____________________", pageWidth - 90, infoStartY + 5);

    /*  TABLE */
    const startY = 56;

    const columns = [
      "No.",
      "Name of Owner",
      "Contact No.",
      "Species",
      "Pet Name",
      "Sex",
      "Age",
      "Vaccine Used",
      "Lot #",
      "Signature",
      "Remarks",
    ];

    const rows = Array.from({ length: 17 }).map((_, i) => {
      const record = displayedRecords[i];

      if (!record) {
        return [i + 1, "", "", "", "", "", "", "", "", "", ""];
      }

      return [
        i + 1,
        record.raiserName || "",
        record.contactNumber || "",
        record.typeOfAnimal || "",
        record.livestockName || "",
        record.recordData?.sex || "",
        record.age || "",
        record.recordData?.vaccine || "",
        record.recordData?.lotNumber || "",
        "",
        record.recordData?.remarks || "",
      ];
    });

    autoTable(doc, {
      startY,
      head: [columns],
      body: rows,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineWidth: 0.3,
        lineColor: [22, 163, 74],
        textColor: [0, 0, 0],
        font: "helvetica",
        valign: "middle",
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: 0,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 10 }, // No.
        1: { cellWidth: 45 }, // Owner
        2: { cellWidth: 30 }, // Contact
        3: { cellWidth: 18 }, // Species
        4: { cellWidth: 25 }, // Pet Name
        5: { cellWidth: 12 }, // Sex
        6: { cellWidth: 12 }, // Age
        7: { cellWidth: 28 }, // Vaccine
        8: { cellWidth: 18 }, // Lot #
        9: { cellWidth: 30 }, // Signature
        10: { cellWidth: 35 }, // Remarks
      },
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    doc.text("Submitted by: ____________________", 14, finalY);
    doc.text("Noted by: ____________________", pageWidth - 90, finalY);

    doc.save("vaccination-report.pdf");
  };

  const handleDownloadPDF = () => {
    if (!displayedRecords.length) return;

    if (activeTable === "vaccination") {
      handleExportVaccinationPDF();
    } else {
      handleExportPDF();
    }
  };

  const resolveCellValue = ({ row, col, activeTable }) => {
    let rawValue;

    if (activeTable === "healthList") {
      rawValue = row[col.key];
    } else if (
      ["vaccination"].includes(activeTable) &&
      [
        "raiserName",
        "contactNumber",
        "typeOfAnimal",
        "livestockName",
        "age",
      ].includes(col.key)
    ) {
      rawValue = row[col.key];
    } else {
      rawValue = row.recordData?.[col.key];
    }

    if (rawValue === "" || rawValue === null || rawValue === undefined) {
      return "—";
    }

    // ✅ Apply formatter if present
    if (col.format) {
      return col.format(rawValue, row);
    }

    return rawValue;
  };

  return (
    <div className="app flex flex-col md:flex-row">
      <Sidebarr />
      <div className="content flex-grow p-2 overflow-auto h-screen">
        <Topbar />
        <div className="top-14 flex flex-col md:flex-row items-start md:items-center justify-between p-1 m-2">
          <Headerr title="Health and Medical Records" />
        </div>

        <div className="p-4">
          {/* Buttons Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              onClick={() => handleButtonClick("healthList")}
              className="flex items-center gap-2 bg-white border border-green-600 px-5 text-xs py-3 rounded-xl shadow hover:bg-green-700 transition"
            >
              <HealingIcon />
              Livestock Health List
            </button>

            <button
              onClick={() => handleButtonClick("vaccination")}
              className="flex items-center gap-2 bg-white border border-blue-600 px-5 text-xs py-3 rounded-xl shadow hover:bg-blue-700 transition"
            >
              <VaccinesIcon />
              Vaccination Record
            </button>

            <button
              onClick={() => handleButtonClick("deworming")}
              className="flex items-center gap-2 bg-white border border-purple-600 text-xs px-5 py-3 rounded-xl shadow hover:bg-purple-800 transition"
            >
              <MedicationIcon />
              Deworming Record
            </button>

            <button
              onClick={() => handleButtonClick("treatment")}
              className="flex items-center gap-2 bg-white border border-red-600 text-xs px-5 py-3 rounded-xl shadow hover:bg-red-700 transition"
            >
              <LocalHospitalIcon />
              Treatment Record
            </button>

            <button
              onClick={() => handleButtonClick("ai")}
              className="flex items-center gap-2 bg-white border border-amber-600 text-xs px-5 py-3 rounded-xl shadow hover:bg-amber-700 transition"
            >
              <BiotechIcon />
              Artificial Insemination Record
            </button>

            <button
              onClick={() => handleButtonClick("unvaccinated")}
              className="flex items-center gap-2 bg-white border border-sky-700 text-xs px-5 py-3 rounded-xl shadow hover:bg-sky-900  transition"
            >
              <MedicationLiquidRoundedIcon />
              Unvaccinated Livestocks
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="m-1 mb-3 px-2 flex-grow overflow-y-auto bg-white-main shadow-md rounded-md">
          <div className="mt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 md:w-96 px-2 py-2 border border-gren-400 rounded-lg shadow-sm
               focus:outline-none focus:ring-2 focus:ring-primary text-xs"
            />

            <div className="flex gap-2">
              <button
                onClick={handleDownloadPDF}
                disabled={!displayedRecords.length}
                className="p-2 h-10 rounded-lg bg-gray-700 text-white text-xs
              hover:bg-gray-600 disabled:opacity-50 disabled:cursor-no-drop"
              >
                Download Report PDF
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="relative overflow-y-auto h-[550px] mt-2 rounded-md">
            <table className="min-w-[500px] w-full text-center border border-gray-300">
              <thead className="h-8 bg-primary uppercase sticky top-0 text-white text-sm">
                <tr>
                  <th className="p-2">No</th>

                  {tableColumns[activeTable].map((col) => (
                    <th key={col.key} className="p-2">
                      {col.label}
                    </th>
                  ))}

                   {isAdmin && (<th className="p-2">Action</th>)}
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={tableColumns[activeTable].length + 1}
                      className="text-center p-4"
                    >
                      Loading records...
                    </td>
                  </tr>
                ) : displayedRecords.length > 0 ? (
                  displayedRecords.map((row, index) => (
                    <tr
                      key={row.id}
                      className="odd:bg-gray-50 hover:bg-green-100 text-xs"
                    >
                      <td className="p-2 border border-gray-400 ">
                        {index + 1}
                      </td>

                      {tableColumns[activeTable].map((col) => (
                        <td
                          key={col.key}
                          className="p-2 border border-gray-400"
                        >
                          {resolveCellValue({ row, col, activeTable })}
                        </td>
                      ))}
                       {isAdmin && (
                      <td className="p-2 border border-gray-400">
                        <IconButton
                          aria-label="delete"
                          onClick={() =>
                            handleDeleteHealthRecord(row.recordData)
                          }
                        >
                          <DeleteRounded
                            sx={{ color: "#a30808", fontSize: 14 }}
                          />
                        </IconButton>
                      </td>
                       )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={tableColumns[activeTable].length + 1}
                      className="text-center p-4"
                    >
                      No records found.
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

export default HealthandMedical;
