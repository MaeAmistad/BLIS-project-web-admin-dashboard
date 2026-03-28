import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import LivestockEdit from "./LivestockEdit";
import Swal from "sweetalert2";
import { notifyAllUsers } from "./NotifyAllUsers";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { useAuth } from "./AuthContext";

const ViewLivestockDetailsModal = ({ open, onClose, raiser }) => {
  const [livestockWithCounts, setLivestockWithCounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editLivestockData, setEditLivestockData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  console.log("Raiser Details: ", raiser);

  const { user } = useAuth();
  
    const isAdmin = user?.role?.toLowerCase() === "admin";

  useEffect(() => {
    if (!open || !raiser?.id) return;

    const fetchHealthCounts = async () => {
      setLoading(true);

      const livestockSnapshot = await getDocs(
        collection(db, "raisers", raiser.id, "livestock"),
      );

      const data = await Promise.all(
        livestockSnapshot.docs.map(async (livestockDoc) => {
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

          return {
            id: livestockDoc.id,
            ...livestockDoc.data(),
            healthRecordsCount: healthSnap.size,

          };
        }),
      );

      setLivestockWithCounts(data);
      setLoading(false);
    };

    fetchHealthCounts();
  }, [open, raiser]);

  const handleDelete = async (livestockId) => {
    const confirm = await Swal.fire({
      title: "Delete Livestock?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    });

    try {
      if (!confirm.isConfirmed) return;

      await deleteDoc(doc(db, "raisers", raiser.id, "livestock", livestockId));

      await notifyAllUsers({
        title: "Livestock Deleted",
        message: `Raiser ${raiser.raiserName}'s livestock has been deleted`,
        type: "delete",
      });

      Swal.fire({
        icon: "success",
        title: "Deleted Livestock",
        text: `Livestock has been deleted for ${raiser.raiserName} `,
        timer: 1500,
        showConfirmButton: false,
      });

      setLivestockWithCounts((prev) =>
        prev.filter((l) => l.id !== livestockId),
      );
    } catch (error) {
      console.error("Delete failed:", error);
      Swal.fire("Error", "Failed to delete livestock.", "error");
    }
  };

  const openEditLivestock = async (livestock) => {
    console.log("Editing livestock:", livestock);

    // const healthSnap = await getDocs(
    //   collection(
    //     db,
    //     "raisers",
    //     raiser.id,
    //     "livestock",
    //     livestock.id,
    //     "healthRecords",
    //   ),
    // );


  const healthPath = collection(
    db,
    "raisers",
    raiser.id,
    "livestock",
    livestock.id,
    "healthRecords",
  );

  console.log("Fetching health records from path:", healthPath.path); // 👈

  const healthSnap = await getDocs(healthPath);

  console.log("Health snap size:", healthSnap.size); // 👈
  console.log("Health snap empty?:", healthSnap.empty);

    const healthRecords = {
      vaccinations: [],
      dewormings: [],
      treatments: [],
      aiRecords: [],
    };

    // healthSnap.forEach((docSnap) => {
      
    //   const data = docSnap.data();
    //   console.log("Health record:", data);
    //   let key = data.type;

    //   if (key === "ai") key = "aiRecords";

    //   if (healthRecords[key]) {
    //     healthRecords[key].push({
    //       id: docSnap.id,
    //       ...data,
    //     });
    //   }
    // });

healthSnap.forEach((docSnap) => {
  console.log("Raw health doc:", docSnap.id, JSON.stringify(docSnap.data())); // 👈
  
  const data = docSnap.data();
  const typeToKey = {
    vaccination: "vaccinations",
    deworming:   "dewormings",
    treatment:   "treatments",
    ai:          "aiRecords",
  };

  const key = typeToKey[data.type];
  console.log("Mapped key:", key); // 👈
  if (key) {
    healthRecords[key].push({ id: docSnap.id, ...data });
  }
});

console.log("Final healthRecords:", JSON.stringify(healthRecords)); // 👈

    setEditLivestockData([
      {
        id: livestock.id,
        ...livestock,
        healthRecords,
      },
    ]);

    setEditOpen(true);
  };

  const handleEditSave = async (livestockList) => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const livestock = livestockList[0];

      const livestockRef = doc(
        db,
        "raisers",
        raiser.id,
        "livestock",
        livestock.id,
      );

      await updateDoc(livestockRef, {
        breed: livestock.breed,
        age: livestock.age,
        colorMarkings: livestock.colorMarkings,
        gender: livestock.gender,
        healthCondition: livestock.healthCondition,
        livestockName: livestock.livestockName,
        status: livestock.status,
        typeOfAnimal: livestock.typeOfAnimal,
        weight: livestock.weight,
        updatedAt: serverTimestamp(),
      });

      const healthRef = collection(
        db,
        "raisers",
        raiser.id,
        "livestock",
        livestock.id,
        "healthRecords",
      );

      const upsert = async (records, type) => {
        for (const record of records) {
          const payload = {
            ...record,
            type,
            updatedAt: serverTimestamp(),
          };

          delete payload.id;

          if (record.id) {
            await updateDoc(doc(healthRef, record.id), payload);
          } else {
            await addDoc(healthRef, {
              ...payload,
              createdAt: serverTimestamp(),
            });
          }
        }
      };

      await upsert(livestock.healthRecords.vaccinations, "vaccination");
      await upsert(livestock.healthRecords.dewormings, "deworming");
      await upsert(livestock.healthRecords.treatments, "treatment");
      await upsert(livestock.healthRecords.aiRecords, "ai");

      setEditOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const show = (v) => (v === null || v === undefined || v === "" ? "-" : v);

  if (!open || !raiser) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl mx-4 p-6 relative overflow-y-auto max-h-[90vh]">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
          >
            ✕
          </button>
          <h2 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Livestock Details
          </h2>
          
          {/* Livestock Information */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1">
            Livestock Information
          </h3>
          {loading ? (
            <p className="text-center text-gray-500">Loading livestock...</p>
          ) : (
            <div className="space-y-4">
              {livestockWithCounts.map((l, index) => (
                <div
                  key={l.id}
                  className="border rounded-xl p-4 bg-gray-50 relative"
                >
                  {/* Header Row: Index + Actions */}
                  <div className="flex items-center justify-between mb-3">
                    {/* Left: Livestock Count */}
                    <div className="text-green-800 rounded-full text-sm font-semibold">
                      Livestock #{index + 1}
                    </div>

                    {/* Right: Action Icons */}
                    <div className="flex gap-3 text-gray-500">
                      <button
                        onClick={() => openEditLivestock(l)}
                        className="hover:text-blue-600"
                        title="Edit"
                      >
                        <EditRounded sx={{ color: "#266b0f", fontSize: 18 }} />
                      </button>

{isAdmin && (
                      <button
                        onClick={() => handleDelete(l.id)}
                        className="hover:text-red-600"
                        title="Delete"
                      >
                        <DeleteRounded
                          sx={{ color: "#a30808", fontSize: 18 }}
                        />
                      </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="grid grid-cols-3 gap-6 text-xs">
                      <p>
                        <strong>Livestock Name:</strong> {show(l.livestockName)}
                      </p>
                      <p>
                        <strong>Type:</strong> {show(l.typeOfAnimal)}
                      </p>
                      <p>
                        <strong>Breed:</strong> {show(l.breed)}
                      </p>
                      <p>
                        <strong>Gender:</strong> {show(l.gender)}
                      </p>
                      <p>
                        <strong>Date Acquired:</strong> {show(l.dateOfBirth)}
                      </p>
                      <p>
                        <strong>Age:</strong> {show(l.age)}
                      </p>
                      <p>
                        <strong>Health Condition:</strong>{" "}
                        {show(l.healthCondition)}
                      </p>
                      <p>
                        <strong>Status:</strong> {show(l.status)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 text-green-700 font-medium text-xs">
                    Health Records: {l.healthRecordsCount}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Footer */}
          <div className="flex justify-center mt-8">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      <LivestockEdit
        open={editOpen}
        initialData={editLivestockData}
        onClose={() => setEditOpen(false)}
        onCancel={() => setEditOpen(false)}
        onSave={handleEditSave}
      />
    </>
  );
};

export default ViewLivestockDetailsModal;
