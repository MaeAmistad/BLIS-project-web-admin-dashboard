import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function HealthRecordsModal({
  open,
  onClose,
  onSubmit,
  onPrevious,
  initialData = {
    vaccinations: [],
    dewormings: [],
    treatments: [],
    aiRecords: [],
  }, // array of arrays: health records per livestock
  livestockList = [], // array of livestock objects
}) {
  const [openSection, setOpenSection] = useState(null);

  const emptyVaccination = {
    vaccine: "",
    date: "",
    administeredBy: "",
    dosage: "",
    remarks: "",
  };

  const emptyDeworming = {
    dewormer: "",
    dateAdministered: "",
    nextSchedule: "",
    administeredBy: "",
    dosage: "",
    remarks: "",
  };

  const emptyTreatment = {
    illness: "",
    medication: "",
    dateStarted: "",
    dateCompleted: "",
    administeredBy: "",
    dosageFrequency: "",
    result: "",
    remarks: "",
  };

  const emptyAI = {
    animalType: "",
    date: "",
    time: "",
    semenType: "",
    specialist: "",
    status: "",
    calvingDate: "",
    remarks: "",
    expectedDelivery:""
  };

  const [vaccinationForm, setVaccinationForm] = useState(emptyVaccination);
  const [dewormingForm, setDewormingForm] = useState(emptyDeworming);
  const [treatmentForm, setTreatmentForm] = useState(emptyTreatment);
  const [aiForm, setAiForm] = useState(emptyAI);

  const [vaccinations, setVaccinations] = useState([]);
  const [dewormings, setDewormings] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [aiRecords, setAiRecords] = useState([]);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  useEffect(() => {
    if (!open) return;

    setVaccinations(initialData.vaccinations || []);
    setDewormings(initialData.dewormings || []);
    setTreatments(initialData.treatments || []);
    setAiRecords(initialData.aiRecords || []);
  }, [open, initialData]);

  useEffect(() => {
    if (!aiForm.date) return;

    const inseminationDate = new Date(aiForm.date);
    inseminationDate.setDate(inseminationDate.getDate() + 21);

    const calvingDate = inseminationDate.toISOString().split("T")[0];

    setAiForm((prev) => ({
      ...prev,
      calvingDate,
    }));
  }, [aiForm.date]);

  const removeVaccination = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This vaccination record will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // red-600
      cancelButtonColor: "#6b7280", // gray-500
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setVaccinations((prev) => prev.filter((_, i) => i !== index));

        Swal.fire({
          title: "Removed",
          text: "The vaccination record has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const removeDeworming = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This deworming record will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // red-600
      cancelButtonColor: "#6b7280", // gray-500
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setDewormings((prev) => prev.filter((_, i) => i !== index));

        Swal.fire({
          title: "Removed",
          text: "The deworming record has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const removeTreatment = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This treatment record will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // red-600
      cancelButtonColor: "#6b7280", // gray-500
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setTreatments((prev) => prev.filter((_, i) => i !== index));

        Swal.fire({
          title: "Removed",
          text: "The treatment record has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const removeAI = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This Artificial Insemination record will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // red-600
      cancelButtonColor: "#6b7280", // gray-500
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setAiRecords((prev) => prev.filter((_, i) => i !== index));

        Swal.fire({
          title: "Removed",
          text: "The Artificial Insemination record has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const ActionButtons = ({ onSave, onAddAnother }) => (
    <div className="flex justify-end gap-3 mt-6">
      <button
        type="button"
        onClick={onSave}
        className="px-4 py-2 bg-green-700 text-white rounded-lg"
      >
        Save Record
      </button>

      <button
        type="button"
        onClick={onAddAnother}
        className="px-4 py-2 border border-green-700 text-green-700 rounded-lg"
      >
        + Add Another Record
      </button>
    </div>
  );

  const handleSubmit = () => {
    onSubmit({
      vaccinations,
      dewormings,
      treatments,
      aiRecords,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg p-6 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Health Records</h2>
          <button onClick={onClose} className="text-red-500 font-medium">
            Close
          </button>
        </div>

        <div className="space-y-6">
          {/* Vaccination */}
          <Section
            title="Vaccination Records"
            button="Add Vaccination Record"
            open={openSection === "vaccination"}
            onClick={() => toggleSection("vaccination")}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Vaccine Name"
                value={vaccinationForm.vaccine}
                onChange={(e) =>
                  setVaccinationForm({
                    ...vaccinationForm,
                    vaccine: e.target.value,
                  })
                }
              />
              <Input
                type="date"
                label="Date"
                value={vaccinationForm.date}
                onChange={(e) =>
                  setVaccinationForm({
                    ...vaccinationForm,
                    date: e.target.value,
                  })
                }
              />
              <Input
                label="Administered By"
                value={vaccinationForm.administeredBy}
                onChange={(e) =>
                  setVaccinationForm({
                    ...vaccinationForm,
                    administeredBy: e.target.value,
                  })
                }
              />
              <Input
                label="Dosage"
                value={vaccinationForm.dosage}
                onChange={(e) =>
                  setVaccinationForm({
                    ...vaccinationForm,
                    dosage: e.target.value,
                  })
                }
              />
              <Textarea
                label="Remarks"
                rows={1}
                className={`${baseInputClass} resize-none overflow-hidden`}
                style={{ height: "38px" }}
                value={vaccinationForm.remarks}
                onChange={(e) =>
                  setVaccinationForm({
                    ...vaccinationForm,
                    remarks: e.target.value,
                  })
                }
              />
            </div>

            <ActionButtons
              onSave={() => {
                setVaccinations([...vaccinations, vaccinationForm]);
                setVaccinationForm(emptyVaccination);
              }}
            />
            {vaccinations.length > 0 && (
              <div className="mt-4 border-t pt-4 space-y-2">
                <p className="text-sm font-medium text-gray-600">
                  Saved Records
                </p>

                {vaccinations.map((record, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-50 border rounded-lg p-3"
                  >
                    <div className="text-sm">
                      <strong>{record.vaccine}</strong> – {record.dosage}
                      <div className="text-xs text-gray-500">{record.date}</div>
                    </div>

                    <button
                      onClick={() => removeVaccination(idx)}
                      className="text-sm "
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Deworming */}
          <Section
            title="Deworming Records"
            button="Add Deworming Record"
            open={openSection === "deworming"}
            onClick={() => toggleSection("deworming")}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Type of Dewormer"
                value={dewormingForm.dewormer}
                onChange={(e) =>
                  setDewormingForm({
                    ...dewormingForm,
                    dewormer: e.target.value,
                  })
                }
              />
              <Input
                type="date"
                label="Date Administered"
                value={dewormingForm.dateAdministered}
                onChange={(e) =>
                  setDewormingForm({
                    ...dewormingForm,
                    dateAdministered: e.target.value,
                  })
                }
              />
              <Input
                type="date"
                label="Next Schedule"
                value={dewormingForm.nextSchedule}
                onChange={(e) =>
                  setDewormingForm({
                    ...dewormingForm,
                    nextSchedule: e.target.value,
                  })
                }
              />
              <Input
                label="Administered By"
                value={dewormingForm.administeredBy}
                onChange={(e) =>
                  setDewormingForm({
                    ...dewormingForm,
                    administeredBy: e.target.value,
                  })
                }
              />
              <Input
                label="Dosage"
                value={dewormingForm.dosage}
                onChange={(e) =>
                  setDewormingForm({ ...dewormingForm, dosage: e.target.value })
                }
              />
              <Textarea
                label="Remarks"
                rows={1}
                className={`${baseInputClass} resize-none overflow-hidden`}
                style={{ height: "38px" }}
                value={dewormingForm.remarks}
                onChange={(e) =>
                  setDewormingForm({
                    ...dewormingForm,
                    remarks: e.target.value,
                  })
                }
              />
            </div>

            <ActionButtons
              onSave={() => {
                setDewormings([...dewormings, dewormingForm]);
                setDewormingForm(emptyDeworming);
              }}
            />

            {dewormings.length > 0 && (
              <div className="mt-4 border-t pt-4 space-y-2">
                <p className="text-sm font-medium text-gray-600">
                  Saved Records
                </p>

                {dewormings.map((record, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-50 border rounded-lg p-3"
                  >
                    <div className="text-sm">
                      <strong>{record.dewormer}</strong> – {record.dosage}
                      <div className="text-xs text-gray-500">
                        Date Administered: {record.dateAdministered}
                      </div>
                      <div className="text-xs text-gray-500">
                        Next Schedule: {record.nextSchedule}
                      </div>
                    </div>

                    <button
                      onClick={() => removeDeworming(idx)}
                      className="text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Treatment */}
          <Section
            title="Treatment Records"
            button="Add Treatment Record"
            open={openSection === "treatment"}
            onClick={() => toggleSection("treatment")}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Illness"
                value={treatmentForm.illness}
                onChange={(e) =>
                  setTreatmentForm({
                    ...treatmentForm,
                    illness: e.target.value,
                  })
                }
              />
              <Input
                label="Medication"
                value={treatmentForm.medication}
                onChange={(e) =>
                  setTreatmentForm({
                    ...treatmentForm,
                    medication: e.target.value,
                  })
                }
              />
              <Input
                type="date"
                label="Date Started"
                value={treatmentForm.dateStarted}
                onChange={(e) =>
                  setTreatmentForm({
                    ...treatmentForm,
                    dateStarted: e.target.value,
                  })
                }
              />
              <Input
                type="date"
                label="Date Completed"
                value={treatmentForm.dateCompleted}
                onChange={(e) =>
                  setTreatmentForm({
                    ...treatmentForm,
                    dateCompleted: e.target.value,
                  })
                }
              />
              <Input
                label="Administered By"
                value={treatmentForm.administeredBy}
                onChange={(e) =>
                  setTreatmentForm({
                    ...treatmentForm,
                    administeredBy: e.target.value,
                  })
                }
              />
              <Input
                label="Dosage / Frequency"
                value={treatmentForm.dosageFrequency}
                onChange={(e) =>
                  setTreatmentForm({
                    ...treatmentForm,
                    dosageFrequency: e.target.value,
                  })
                }
              />
              <Select
                label="Result"
                options={["Recovered", "Ongoing", "Deceased"]}
                value={treatmentForm.result}
                onChange={(e) =>
                  setTreatmentForm({ ...treatmentForm, result: e.target.value })
                }
              />
              <Textarea
                label="Remarks"
                rows={1}
                className={`${baseInputClass} resize-none overflow-hidden`}
                style={{ height: "38px" }}
                value={treatmentForm.remarks}
                onChange={(e) =>
                  setTreatmentForm({
                    ...treatmentForm,
                    remarks: e.target.value,
                  })
                }
              />
            </div>

            <ActionButtons
              onSave={() => {
                setTreatments([...treatments, treatmentForm]);
                setTreatmentForm(emptyTreatment);
              }}
            />

            {treatments.length > 0 && (
              <div className="mt-4 border-t pt-4 space-y-2">
                <p className="text-sm font-medium text-gray-600">
                  Saved Records
                </p>

                {treatments.map((record, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-50 border rounded-lg p-3"
                  >
                    <div className="text-sm">
                      <strong>{record.illness}</strong> – {record.medication}
                      <div className="text-xs text-gray-500">
                        Date Started: {record.dateStarted}
                      </div>
                      <div className="text-xs text-gray-500">
                        Date Completed: {record.dateCompleted}
                      </div>
                    </div>

                    <button
                      onClick={() => removeTreatment(idx)}
                      className="text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Artificial Insemination */}
          <Section
            title="Artificial Insemination Records"
            button="Add Artificial Insemination Record"
            open={openSection === "ai"}
            onClick={() => toggleSection("ai")}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Type of Animal"
                value={aiForm.animalType}
                onChange={(e) =>
                  setAiForm({ ...aiForm, animalType: e.target.value })
                }
              />
              <Input
                label="Date of Insemination"
                type="date"
                value={aiForm.date}
                onChange={(e) => setAiForm({ ...aiForm, date: e.target.value })}
              />
              <Input
                label="Type of Semen Used"
                value={aiForm.semenType}
                onChange={(e) =>
                  setAiForm({ ...aiForm, semenType: e.target.value })
                }
              />
              <Input
                label="AI Specialist Name"
                value={aiForm.specialist}
                onChange={(e) =>
                  setAiForm({ ...aiForm, specialist: e.target.value })
                }
              />
              <Select
                label="Status"
                options={["Pending", "Successful", "Failed"]}
                value={aiForm.status}
                onChange={(e) =>
                  setAiForm({ ...aiForm, status: e.target.value })
                }
              />
              <Input
                label="Re-heat Monitoring"
                type="date"
                value={aiForm.calvingDate}
                onChange={(e) =>
                  setAiForm({ ...aiForm, calvingDate: e.target.value })
                }
              />
              <Textarea
                label="Remarks"
                rows={2}
                className={`${baseInputClass} resize-none overflow-hidden`}
                style={{ height: "38px" }}
                onChange={(e) =>
                  setAiForm({
                    ...aiForm,
                    remarks: e.target.value,
                  })
                }
              />
              <Input
                label="Expected Delivery"
                type="date"
                value={aiForm.expectedDelivery}
                onChange={(e) =>
                  setAiForm({ ...aiForm, expectedDelivery: e.target.value })
                }
              />
            </div>

            <ActionButtons
              onSave={() => {
                setAiRecords([...aiRecords, aiForm]);
                setAiForm(emptyAI);
              }}
            />

            {aiRecords.length > 0 && (
              <div className="mt-4 border-t pt-4 space-y-2">
                <p className="text-sm font-medium text-gray-600">
                  Saved Records
                </p>

                {aiRecords.map((record, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-50 border rounded-lg p-3"
                  >
                    <div className="text-sm">
                      <strong>{record.animalType}</strong> – {record.semenType}
                      <div className="text-xs text-gray-500">
                        AI Specialist: {record.specialist}
                      </div>
                      <div className="text-xs text-gray-500">
                        Status: {record.status}
                      </div>
                    </div>

                    <button onClick={() => removeAI(idx)} className="text-sm">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-5 py-2 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-green-700 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

const baseInputClass =
  "w-full border rounded px-3 py-2 text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-green-600";

const Input = ({ label, type = "text", ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input type={type} className={baseInputClass} {...props} />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea className={`${baseInputClass} resize-none`} {...props} />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select className="w-full border rounded px-3 py-2" {...props}>
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);

const Section = ({ title, button, open, onClick, children }) => (
  <div className="border-2 rounded-xl p-4">
    <h3 className="text-lg font-semibold text-green-700 mb-3">{title}</h3>

    <button
      onClick={onClick}
      className="w-full bg-green-700 text-white py-2 rounded-lg font-medium"
    >
      {button}
    </button>

    {open && <div className="mt-4 border-t pt-4">{children}</div>}
  </div>
);
