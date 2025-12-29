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

const HealthandMedical = () => {
  const [activeTable, setActiveTable] = useState(null);
  const [raisers, setRaisers] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [livestock, setLivestock] = useState([]);

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

  const joinedRecords = useMemo(() => {
    if (!healthRecords || !livestock || !raisers) return [];

    return healthRecords.map((record) => {
      const animal = livestock.find((l) => l.id === record.livestockId);
      const raiser = raisers.find((r) => r.id === record.raiserId);

      return {
        ...record,
        livestockTag: animal?.tag || "—",
        livestockType: animal?.type || "—",
        raiserName: raiser ? `${raiser.firstName} ${raiser.lastName}` : "—",
      };
    });
  }, [healthRecords, livestock, raisers]);

  const filteredRecords = useMemo(() => {
    if (!activeTable) return [];
    return joinedRecords.filter(
      (r) => r.type === activeTable // vaccination, deworming, etc.
    );
  }, [activeTable, joinedRecords]);

  const handleButtonClick = (tableName) => {
    // Toggle visibility
    setActiveTable(activeTable === tableName ? null : tableName);
  };

  return (
    <div className="app flex flex-col md:flex-row">
      <Sidebarr />
      <div className="content flex-grow p-2 overflow-auto h-screen">
        <Topbar />
        <div className="sticky top-14 flex flex-col md:flex-row items-start md:items-center justify-between p-1 m-2">
          <Headerr title="Health and Medical Records" />
        </div>

        <div className="p-6">
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

            <button
              onClick={() => handleButtonClick("summary")}
              className="flex items-center gap-2 bg-gray-700 text-white px-5 py-3 rounded-xl shadow hover:bg-gray-800 transition"
            >
              <AssessmentIcon />
              Health Summary Report
            </button>
          </div>

          {/* Conditional Tables */}

          {/* CONDITIONAL TABLES */}
          <div className="mt-6">
            {/* VACCINATION */}
            {activeTable === "vaccination" && (
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-3">
                  Vaccination Records
                </h2>

                <table className="w-full text-left border">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="p-2 border">Raiser</th>
                      <th className="p-2 border">Livestock Tag</th>
                      <th className="p-2 border">Vaccine</th>
                      <th className="p-2 border">Date</th>
                      <th className="p-2 border">Dosage</th>
                      <th className="p-2 border">Administered By</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tbody>
                      {filteredRecords && filteredRecords.length > 0 ? (
                        filteredRecords.map((r) => (
                          <tr key={r.id}>
                            <td>{r.raiserName}</td>
                            <td>{r.livestockTag}</td>
                            <td>{r.vaccineName}</td>
                            <td>{r.date}</td>
                            <td>{r.dosage}</td>
                            <td>{r.administeredBy}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center p-2">
                            No records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </tbody>
                </table>
              </div>
            )}

            {/* DEWORMING */}
            {activeTable === "deworming" && (
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-3">
                  Deworming Records
                </h2>

                <table className="w-full text-left border">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="p-2 border">Raiser</th>
                      <th className="p-2 border">Livestock Tag</th>
                      <th className="p-2 border">Dewormer</th>
                      <th className="p-2 border">Date</th>
                      <th className="p-2 border">Dosage</th>
                      <th className="p-2 border">Next Schedule</th>
                    </tr>
                  </thead>

                  <tbody>
                  </tbody>
                </table>
              </div>
            )}

            {/* Add Treatment / AI the same way */}
          </div>

          {/* {activeTable === "summary" && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">
                Health Summary Report
              </h2>
              <p>
                This section will display summarized livestock health analytics.
              </p>
            </div>
          )} */}
        </div>

        {/* Main Body */}
        <div className="m-1 flex-grow overflow-y-auto bg-white-main shadow-md rounded-md">
          {/* Search Filters */}
          {/* <div className="p-1">
            <div>
              <div className="flex my-1 mx-1 space-x-1">
                <input
                  type="text"
                  placeholder="Search Bar"
                  className="w-full sm:max-w-sm border border-green-400 focus:ring-2 focus:ring-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>
          </div> */}

          {/* Table */}
          <div className="relative overflow-y-auto h-[550px] border border-gray-300 rounded-md">
            <table cclassName="min-w-[500px] w-full text-center">
              <thead className="h-6 bg-primary uppercase sticky top-0 text-white text-sm">
                <tr>
                  <th className="w-[50px]">NO</th>
                  <th className="w-[300px]">Raiser Name</th>
                  <th className="w-[250px]">Barangay</th>
                  <th className="w-[350px]">List of Livestocks</th>
                  <th className="w-[350px]">No of Livestocks</th>
                  <th className="w-[250px]">Registration Status</th>
                  <th className="w-[150px]">Action</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthandMedical;
