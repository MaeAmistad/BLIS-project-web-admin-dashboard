import React, { useEffect, useMemo, useState } from "react";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import HealingIcon from "@mui/icons-material/Healing";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import MedicationIcon from "@mui/icons-material/Medication";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import BiotechIcon from "@mui/icons-material/Biotech";
import Headerr from "../../components/Headerr";
import { collection, getDocs, collectionGroup } from "firebase/firestore";
import { db } from "../../firebase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const tableColumns = {
  healthList: [
    { label: "Raiser Name", key: "raiserName" },
    { label: "Barangay", key: "address" },
    { label: "Livestock Type", key: "typeOfAnimal" },
    { label: "Health Condition", key: "healthCondition" },
    { label: "Record Type", key: "recordType" },
  ],

  vaccination: [
    { label: "Name of Owner", key: "raiserName" },
    { label: "Contact No", key: "contactNumber" },
    { label: "Species", key: "typeOfAnimal" },
    { label: "Pet Name", key: "livestockName" },
    { label: "Age", key: "age" },
    { label: "Vaccine Used", key: "vaccine" },
    { label: "Date", key: "date" },
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
    { label: "Date", key: "date" },
    { label: "Time", key: "time" },
    { label: "Semen Type", key: "semenType" },
    { label: "Specialist", key: "specialist" },
    { label: "Status", key: "status" },
    { label: "Calving Date", key: "calvingDate" },
    { label: "Remarks", key: "remarks" },
  ],
};

const HealthandMedical = () => {
  const [activeTable, setActiveTable] = useState("healthList");
  const [raisers, setRaisers] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [livestock, setLivestock] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllHealthRecords = async () => {
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

  const joinedRecords = useMemo(() => {
    if (!healthRecords.length || !livestock.length || !raisers.length)
      return [];

    return healthRecords.map((record) => {
      const animal = livestock.find((l) => l.id === record.livestockId);
      const raiser = raisers.find((r) => r.id === record.raiserId);

      return {
        id: record.id,
        recordType: record.type, // vaccination, deworming, etc
        recordData: record, // full health record

        raiserName: raiser ? `${raiser.firstName} ${raiser.lastName}` : "—",
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
    let data =
      activeTable === "healthList"
        ? joinedRecords
        : joinedRecords.filter((r) => r.recordType === activeTable);

    if (!searchTerm.trim()) return data;

    const term = searchTerm.toLowerCase();

    return data.filter((row) => {
      // Fields always available
      const baseFields = [
        row.raiserName,
        row.address,
        row.typeOfAnimal,
        row.healthCondition,
        row.recordType,
      ];

      // Dynamic fields based on active table
      const dynamicFields =
        activeTable === "healthList" ? [] : Object.values(row.recordData || {});

      return [...baseFields, ...dynamicFields].some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(term)
      );
    });
  }, [activeTable, joinedRecords, searchTerm]);

  const handleButtonClick = (tableName) => {
    setActiveTable(tableName);
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

    doc.setFontSize(14);
    doc.text(titleMap[activeTable], 14, 15);

    doc.setFontSize(9);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    const columns = tableColumns[activeTable].map((col) => col.label);

    const rows = displayedRecords.map((row) =>
      tableColumns[activeTable].map((col) =>
        activeTable === "healthList"
          ? row[col.key] ?? "—"
          : row.recordData[col.key] ?? "—"
      )
    );

    autoTable(doc, {
      startY: 26,
      head: [columns],
      body: rows,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 163, 74], // green
      },
    });

    doc.save(`${activeTable}-report.pdf`);
  };

  const handleExportExcel = () => {
    if (!displayedRecords.length) return;

    const data = displayedRecords.map((row) => {
      const result = {};

      tableColumns[activeTable].forEach((col) => {
        result[col.label] =
          activeTable === "healthList"
            ? row[col.key] ?? ""
            : row.recordData[col.key] ?? "";
      });

      return result;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, activeTable);

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `${activeTable}-report.xlsx`);
  };

  return (
    <div className="app flex flex-col md:flex-row">
      <Sidebarr />
      <div className="content flex-grow p-2 overflow-auto h-screen">
        <Topbar />
        <div className="sticky top-14 flex flex-col md:flex-row items-start md:items-center justify-between p-1 m-2">
          <Headerr title="Health and Medical Records" />
        </div>

        <div className="p-4">
          {/* Buttons Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => handleButtonClick("healthList")}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl shadow hover:bg-green-700 transition"
            >
              <HealingIcon />
              Livestock Health List
            </button>

            <button
              onClick={() => handleButtonClick("vaccination")}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl shadow hover:bg-blue-700 transition"
            >
              <VaccinesIcon />
              Vaccination Record
            </button>

            <button
              onClick={() => handleButtonClick("deworming")}
              className="flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-xl shadow hover:bg-purple-700 transition"
            >
              <MedicationIcon />
              Deworming Record
            </button>

            <button
              onClick={() => handleButtonClick("treatment")}
              className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-xl shadow hover:bg-red-700 transition"
            >
              <LocalHospitalIcon />
              Treatment Record
            </button>

            <button
              onClick={() => handleButtonClick("ai")}
              className="flex items-center gap-2 bg-amber-600 text-white px-5 py-3 rounded-xl shadow hover:bg-amber-700 transition"
            >
              <BiotechIcon />
              Artificial Insemination Record
            </button>

            {/* <button
              onClick={() => handleButtonClick("summary")}
              className="flex items-center gap-2 bg-gray-700 text-white px-5 py-3 rounded-xl shadow hover:bg-gray-800 transition"
            >
              <AssessmentIcon />
              Health Summary Report
            </button> */}
          </div>
        </div>

        {/* Main Body */}
        <div className="m-1 mb-3 px-2 flex-grow overflow-y-auto bg-white-main shadow-md rounded-md">
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg shadow-sm
               focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="flex gap-2">
              <button
                onClick={handleExportPDF}
                disabled={!displayedRecords.length}
                className="px-4 py-2 rounded-lg bg-red-600 text-white
                 hover:bg-red-700 disabled:opacity-50"
              >
                Download Report PDF
              </button>

              <button
                onClick={handleExportExcel}
                disabled={!displayedRecords.length}
                className="px-4 py-2 rounded-lg bg-green-600 text-white
                 hover:bg-green-700 disabled:opacity-50"
              >
                Download Report Excel
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="relative overflow-y-auto h-[550px] mt-1 rounded-md">
            <table className="min-w-[500px] w-full text-center border border-gray-300">
              <thead className="h-6 bg-primary uppercase sticky top-0 text-white text-sm">
                <tr>
                  <th className="p-2">No</th>

                  {tableColumns[activeTable].map((col) => (
                    <th key={col.key} className="p-2">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {displayedRecords.length > 0 ? (
                  displayedRecords.map((row, index) => (
                    <tr
                      key={row.id}
                      className="odd:bg-gray-50 hover:bg-green-100"
                    >
                      <td className="p-2 border border-gray-400 ">
                        {index + 1}
                      </td>

                      {tableColumns[activeTable].map((col) => (
                        <td
                          key={col.key}
                          className="p-2 border border-gray-400"
                        >
                          {activeTable === "healthList" && row[col.key]}

                          {activeTable === "vaccination" &&
                            ([
                              "raiserName",
                              "contactNumber",
                              "typeOfAnimal",
                              "livestockName",
                              "age",
                            ].includes(col.key)
                              ? row[col.key]
                              : row.recordData[col.key])}

                          {["deworming", "treatment", "ai"].includes(
                            activeTable
                          ) && row.recordData[col.key]}

                          {!row[col.key] && !row.recordData[col.key] && "—"}
                        </td>
                      ))}
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
