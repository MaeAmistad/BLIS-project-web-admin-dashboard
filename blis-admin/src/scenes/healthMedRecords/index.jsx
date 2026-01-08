import React, { useEffect, useMemo, useState } from "react";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import HealingIcon from "@mui/icons-material/Healing";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import MedicationIcon from "@mui/icons-material/Medication";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import BiotechIcon from "@mui/icons-material/Biotech";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Headerr from "../../components/Headerr";
import { collection, getDocs, collectionGroup } from "firebase/firestore";
import { db } from "../../firebase";

const tableColumns = {
  healthList: [
    { label: "Raiser Name", key: "raiserName" },
    { label: "Barangay", key: "barangay" },
    { label: "Livestock Type", key: "livestockType" },
    { label: "Health Condition", key: "healthCondition" },
    { label: "Record Type", key: "recordType" },
  ],

  vaccination: [
    { label: "Vaccine", key: "vaccine" },
    { label: "Date", key: "date" },
    { label: "Administered By", key: "administeredBy" },
    { label: "Dosage", key: "dosage" },
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
        barangay: raiser?.address || "—",

        livestockType: animal?.typeOfAnimal || "—",
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
        row.barangay,
        row.livestockType,
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
        <div className="m-1 flex-grow overflow-y-auto bg-white-main shadow-md rounded-md">
          <div className="mt-4 flex justify-start">
            <input
              type="text"
              placeholder="Search Records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-xs ml-2 mb-1 border border-green-600 focus:ring-1 focus:ring-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400"
            />
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
                    <tr key={row.id} className="odd:bg-gray-50 hover:bg-green-100">
                      <td className="p-2 border border-gray-400 ">{index + 1}</td>

                      {tableColumns[activeTable].map((col) => (
                        <td key={col.key} className="p-2 border border-gray-400">
                          {activeTable === "healthList"
                            ? row[col.key]
                            : row.recordData[col.key] || "—"}
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
