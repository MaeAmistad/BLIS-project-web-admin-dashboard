import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo1 from "../assets/bantaylogo.jpg";
import logo2 from "../assets/duras.jpg";
import logo3 from "../assets/mao.jpg";
import logo4 from "../assets/pilipins.png";

const EXCLUDED_FIELDS = [
  "id",
  "type",
  "createdAt",
  "updatedAt",
  "healthRecords",
];
const LIVESTOCK_FIELD_ORDER = [
  "livestockName",
  "typeOfAnimal",
  "breed",
  "gender",
  "age",
  "dateOfBirth",
  "colorMarkings",
  "weight",
  "healthCondition",
  "status",
];

const LABEL_OVERRIDES = {
  calvingDate: "Re-heat Monitoring",
};

const formatLabel = (key) => {
  if (LABEL_OVERRIDES[key]) return LABEL_OVERRIDES[key];

  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const formatRecordType = (type) => {
  if (!type) return "";

  const normalized = type.toLowerCase();

  if (normalized === "ai") return "Artificial Insemination";

  return type
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};


const renderDynamicFields = (obj) => (
  <div className="grid grid-cols-2 border border-green-400 rounded-md overflow-hidden">
    {LIVESTOCK_FIELD_ORDER.map((key) => {
      const value = obj[key];

      if (
        EXCLUDED_FIELDS.includes(key) ||
        value === "" ||
        value === null ||
        value === undefined
      ) {
        return null;
      }

      return (
        <React.Fragment key={key}>
          <div className="px-3 py-2 text-xs font-medium text-gray-900 border-b border-r border-green-400">
            {formatLabel(key)}
          </div>
          <div className="px-3 py-2 text-xs text-gray-700 border-b border-green-400 break-words">
            {String(value)}
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

const renderDynamicRecords = (obj) => (
  <div className="grid grid-cols-2 border border-green-400 rounded-md overflow-hidden">
    {Object.entries(obj).map(([key, value]) => {
      if (
        EXCLUDED_FIELDS.includes(key) ||
        value === "" ||
        value === null ||
        value === undefined
      ) {
        return null;
      }

      return (
        <React.Fragment key={key}>
          <div className="px-3 py-2 text-sm font-medium text-gray-900 border-b border-r border-green-200">
            {formatLabel(key)}
          </div>
          <div className="px-3 py-2 text-sm text-gray-700 border-b border-green-200 break-words">
            {String(value)}
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

const RAISER_EXCLUDED_FIELDS = ["id"];

const renderInfoGrid = (obj) =>
  Object.entries(obj).map(([key, value]) => {
    if (
      RAISER_EXCLUDED_FIELDS.includes(key) ||
      value === "" ||
      value === null ||
      value === undefined
    ) {
      return null;
    }

    return (
      <div key={key} className="flex flex-col">
        <span className="font-medium text-gray-900">{formatLabel(key)}</span>
        <span className="text-gray-600">{String(value)}</span>
      </div>
    );
  });

const LivestockViewInfo = ({ visible, raiserInfo, onClose }) => {
  const [openHealth, setOpenHealth] = useState({});

  console.log("Passed Raiser Info: ", raiserInfo);

  const [livestock, setLivestock] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLivestockWithHealth = async (raiserId) => {
    const livestockRef = collection(db, "raisers", raiserId, "livestock");
    const livestockSnap = await getDocs(livestockRef);

    const livestockWithHealth = await Promise.all(
      livestockSnap.docs.map(async (livestockDoc) => {
        const livestockData = {
          id: livestockDoc.id,
          ...livestockDoc.data(),
        };

        const healthRef = collection(
          db,
          "raisers",
          raiserId,
          "livestock",
          livestockDoc.id,
          "healthRecords",
        );

        const healthSnap = await getDocs(healthRef);

        const healthRecords = healthSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return {
          ...livestockData,
          healthRecords,
        };
      }),
    );

    return livestockWithHealth;
  };

  useEffect(() => {
    if (!raiserInfo?.id) return;

    const loadData = async () => {
      setLoading(true);
      const data = await fetchLivestockWithHealth(raiserInfo.id);
      setLivestock(data);
      setLoading(false);
    };

    loadData();
  }, [raiserInfo]);

  const toggleHealthRecords = (livestockId) => {
    setOpenHealth((prev) => ({
      ...prev,
      [livestockId]: !prev[livestockId],
    }));
  };

  const handlePrint = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 52;

    /* HEADER*/
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


    const imgSize = 18;
    const imgY = headerY - 8;
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

    doc.setFontSize(14);
    doc.text("Raiser and Livestock Information", centerX, 42, { align: "center" });

    const LABEL_COL_WIDTH = 45;
    const VALUE_COL_WIDTH = pageWidth - 36 - LABEL_COL_WIDTH;
    

    const COMPACT_LABEL_COL_WIDTH = 35;
    const COMPACT_VALUE_COL_WIDTH = pageWidth - 36 - COMPACT_LABEL_COL_WIDTH;

    /*  PERSONAL INFO  */
    doc.setFontSize(11);
    doc.text("Personal Information", 18, y - 4);

    autoTable(doc, {
      startY: y,
      theme: "grid",
      styles: {
        fontSize: 9,
        lineWidth: 0.3, 
        lineColor: [22, 163, 74],
      },
      columnStyles: {
        0: { cellWidth: LABEL_COL_WIDTH },
        1: { cellWidth: VALUE_COL_WIDTH },
      },
      body: Object.entries({
        name: raiserInfo.raiserName,
        gender: raiserInfo.gender,
        contactNumber: raiserInfo.contactNumber,
        email: raiserInfo.email,
        barangay: raiserInfo.address,
      })
        .filter(([, v]) => v)
        .map(([k, v]) => [formatLabel(k), String(v)]),
    });

    y = doc.lastAutoTable.finalY + 10;

    /* FARM INFO*/
    doc.text("Farm Information", 18, y - 4);

    autoTable(doc, {
      startY: y,
      theme: "grid",
      styles: {
        fontSize: 9,
        lineWidth: 0.3,
        lineColor: [22, 163, 74],
      },
      columnStyles: {
        0: { cellWidth: LABEL_COL_WIDTH },
        1: { cellWidth: VALUE_COL_WIDTH },
      },
      body: Object.entries({
        farmName: raiserInfo.farmName,
        farmLocation: raiserInfo.farmLocation,
        farmSize: raiserInfo.farmSize,
        numberOfWorkers: raiserInfo.numberOfWorkers,
        typeOfRaiser: raiserInfo.typeOfRaiser,
        registrationStatus: raiserInfo.registrationStatus,
        dateOfRegistration: raiserInfo.dateOfRegistration,
      })
        .filter(([, v]) => v)
        .map(([k, v]) => [formatLabel(k), String(v)]),
    });

    y = doc.lastAutoTable.finalY + 12;

    /*LIVESTOCK */
    livestock.forEach((animal, index) => {
      doc.setFontSize(12);
      doc.text(`Livestock ${index + 1}`, 14, y);
      y += 6;

      autoTable(doc, {
        startY: y,
        theme: "striped",
        styles: {
          fontSize: 9,
          lineWidth: 0.3, 
          lineColor: [22, 163, 74],
        },
        columnStyles: {
          0: { cellWidth: LABEL_COL_WIDTH },
          1: { cellWidth: VALUE_COL_WIDTH },
        },
        body: Object.entries(animal)
          .filter(
            ([key, value]) =>
              !EXCLUDED_FIELDS.includes(key) &&
              key !== "healthRecords" &&
              value,
          )
          .map(([k, v]) => [formatLabel(k), String(v)]),
      });

      y = doc.lastAutoTable.finalY + 6;

      if (animal.healthRecords?.length) {
        doc.setFontSize(11);
        doc.text("Health Records", 18, y);
        y += 4;

        animal.healthRecords.forEach((record) => {
          // RECORD TYPE AS HEADER 
          if (record.type) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text(record.type.toUpperCase(), 22, y);
            y += 4;
          }

          // RECORD DETAILS TABLE 
          autoTable(doc, {
            startY: y,
            theme: "grid",
            styles: {
              fontSize: 8,
              lineWidth: 0.3, // 👈 thin border
              lineColor: [22, 163, 74],
            },
            columnStyles: {
              0: { cellWidth: 40 },
              1: { cellWidth: 130 },
            },
            body: Object.entries(record)
              .filter(
                ([key, value]) =>
                  key !== "type" && !EXCLUDED_FIELDS.includes(key) && value,
              )
              .map(([k, v]) => [formatLabel(k), String(v)]),
          });

          y = doc.lastAutoTable.finalY + 6;

         
          if (y > 180) {
            doc.addPage();
            y = 40;
          }
        });
      }
    });

    doc.save(`Raiser_${raiserInfo.raiserName}_Livestock.pdf`);
  };

  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div
        className="bg-white rounded-xl w-full max-w-4xl p-6
                  max-h-[85vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-semibold">Raiser & Farm Information</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="text-xs px-3 py-1.5 rounded bg-black text-white font-medium"
            >
              🖨 Print
            </button>

            <button
              onClick={onClose}
              className="text-red-500 text-xl font-semibold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Raiser Info */}
        <div className="mb-8">
          {/* PERSONAL INFO */}
          <div className="border rounded-lg p-4 bg-gray-50 mb-2">
            <h3 className="font-semibold mb-3 text-sm text-gray-700">
              Personal Information
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {renderInfoGrid({
                name: raiserInfo.raiserName,
                contactNumber: raiserInfo.contactNumber,
                email: raiserInfo.email,
                typeOfRaiser: raiserInfo.typeOfRaiser,
                barangay: raiserInfo.address,
              })}
            </div>
          </div>

          {/* FARM INFO */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-3 text-sm text-gray-700">
              Farm Information
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {renderInfoGrid({
                farmName: raiserInfo.farmName,
                farmLocation: raiserInfo.farmLocation,
                farmSize: raiserInfo.farmSize,
                numberOfWorkers: raiserInfo.numberOfWorkers,

                registrationStatus: raiserInfo.registrationStatus,
                dateOfRegistration: raiserInfo.dateOfRegistration,
              })}
            </div>
          </div>
        </div>

        {/* Livestock */}
        <h3 className="text-xl font-semibold mb-2">Livestock Details</h3>

        {loading ? (
          <p>Loading livestock...</p>
        ) : livestock.length === 0 ? (
          <p className="text-gray-500">No livestock found</p>
        ) : (
          <div className="space-y-3">
            {livestock.map((animal, index) => (
              <div key={animal.id} className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold mb-2">Livestock {index + 1}</h4>

                {/* LIVESTOCK FIELDS (dynamic) */}
                {renderDynamicFields(animal)}

                {/* HEALTH RECORDS */}
                <div className="mt-4 border-t pt-3">
                  <div className="space-y-3">
                    <div className="mt-3">
                      <div
                        className={`flex items-center justify-between select-none ${
                          animal.healthRecords?.length > 0
                            ? "cursor-pointer"
                            : ""
                        }`}
                        onClick={() => {
                          if (animal.healthRecords?.length > 0) {
                            toggleHealthRecords(animal.id);
                          }
                        }}
                      >
                        <h5
                          className={`font-semibold text-sm ${
                            animal.healthRecords?.length > 0
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        >
                          {animal.healthRecords?.length > 0
                            ? "Health Records"
                            : "No Health Records for this Livestock"}
                        </h5>

                        {animal.healthRecords?.length > 0 && (
                          <span className="text-xs p-1.5 rounded-lg text-white bg-primary">
                            {openHealth[animal.id]
                              ? "Close Details ▼"
                              : "Open Details ▶"}
                          </span>
                        )}
                      </div>

                      {animal.healthRecords?.length > 0 &&
                        openHealth[animal.id] && (
                          <div className="mt-3 border-t pt-3 space-y-3">
                            {animal.healthRecords.map((record) => (
                              <div
                                key={record.id}
                                className="border rounded-md p-3 bg-white"
                              >
                                {record.type && (
                                  <p className="font-semibold text-xs mb-1 capitalize">
                                    {formatRecordType(record.type)}
                                  </p>
                                )}

                                {renderDynamicRecords(record)}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LivestockViewInfo;
