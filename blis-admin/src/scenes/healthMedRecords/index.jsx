import React, { useState } from "react";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import TreatmentRecordModal from "../../components/TreatmentRecordModal";
import ArtificialInseminationModal from "../../components/ArtificialInseminationModal";
import LivestockHealthListModal from "../../components/LivestockHealthListModal";
import VaccinationRecordModal from "../../components/VaccinationModal";
import DewormingRecordModal from "../../components/DewormingRecord";
import HealingIcon from "@mui/icons-material/Healing";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import MedicationIcon from "@mui/icons-material/Medication";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import BiotechIcon from "@mui/icons-material/Biotech";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Headerr from "../../components/Headerr";

const HealthandMedical = () => {
  const [activeTable, setActiveTable] = useState(null);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showVaccinationModal, setShowVaccinationModal] = useState(false);
  const [showDewormingModal, setShowDewormingModal] = useState(false);


  const handleButtonClick = (tableName) => {
    // Toggle visibility
    setActiveTable(activeTable === tableName ? null : tableName);
  };

  return (
    <div className="flex bg-[#F5F5F5] min-h-screen">
      <Sidebarr />
      <div className="w-full">
        <Topbar />
        <div className="flex justify-between items-center">
          <Headerr title="Health and Medical Records" />
        </div>

        <div className="p-6">
          {/* Buttons Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
          
          {activeTable === "healthList" && (
            <div className="bg-white p-4 rounded-lg shadow">

              <h2 className="text-lg font-semibold mb-3">
                Livestock Health List
              </h2>
              <table className="w-full text-left border">
                <thead className="bg-green-100">
                  <tr>
                    <th className="p-2 border">Livestock Name/Tag</th>
                    <th className="p-2 border">Type/Breed</th>
                    <th className="p-2 border">Owner/Raiser</th>
                    <th className="p-2 border">Health Status</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>

                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTable === "vaccination" && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">Vaccination Record</h2>
              <table className="w-full text-left border">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="p-2 border">Livestock Name/Tag</th>
                    <th className="p-2 border">Vaccination Name</th>
                    <th className="p-2 border">Date of Vaccination</th>
                    <th className="p-2 border">Administered By</th>
                    <th className="p-2 border">Dosage</th>
                    <th className="p-2 border">Remarks</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>

                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTable === "deworming" && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">Deworming Record</h2>
              <table className="w-full text-left border">
                <thead className="bg-purple-100">
                  <tr>
                    <th className="p-2 border">Livestock Name/Tag</th>
                    <th className="p-2 border">Type of Dewormer</th>
                    <th className="p-2 border">Date Administered </th>
                    <th className="p-2 border">Next Schedule</th>
                    <th className="p-2 border">Administered By</th>
                    <th className="p-2 border">Dosage</th>
                    <th className="p-2 border">Remarks</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>

                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTable === "treatment" && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">Treatment Record</h2>
              <table className="w-full text-left border">
                <thead className="bg-red-100">
                  <tr>
                    <th className="p-2 border">Livestock Name/Tag Number</th>
                    <th className="p-2 border">Type of Illness</th>
                    <th className="p-2 border">Medication</th>
                    <th className="p-2 border">Date Started</th>
                    <th className="p-2 border">Date Completed</th>
                    <th className="p-2 border">Administered By</th>
                    <th className="p-2 border">Dosage/Frequency</th>
                    <th className="p-2 border">Result</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>

                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTable === "ai" && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">
                Artificial Insemination Record
              </h2>
              <table className="w-full text-left border">
                <thead className="bg-amber-100">
                  <tr>
                    <th className="p-2 border">Livestock Name/Tag Number</th>
                    <th className="p-2 border">Type of Animal</th>
                    <th className="p-2 border">Date of Insemenation</th>
                    <th className="p-2 border">Time</th>
                    <th className="p-2 border">Type of Semen</th>
                    <th className="p-2 border">AI Specialist Name</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Date of Calving</th>
                    <th className="p-2 border">Remarks</th>
                    <th className="p-2 border">Technician</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>

                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTable === "summary" && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">Health Summary Report</h2>
              <p>This section will display summarized livestock health analytics.</p>
            </div>
          )}
        </div>

        {showTreatmentModal && (
          <TreatmentRecordModal open={true} onClose={() => setShowTreatmentModal(false)} />
        )}

        {showAIModal && (
          <ArtificialInseminationModal open={true} onClose={() => setShowAIModal(false)} />
        )}
        {showHealthModal && (
          <LivestockHealthListModal open={true} onClose={() => setShowHealthModal(false)} />
        )}
        {showVaccinationModal && (
          <VaccinationRecordModal open={true} onClose={() => setShowVaccinationModal(false)} />
        )}
        {showDewormingModal && (
          <DewormingRecordModal open={true} onClose={() => setShowDewormingModal(false)} />
        )}

      </div>
    </div>
  );
};

export default HealthandMedical;
