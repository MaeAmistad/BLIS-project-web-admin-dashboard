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

const ViewLivestockDetailsModal = ({ open, onClose, raiser }) => {
  const [livestockWithCounts, setLivestockWithCounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editLivestockData, setEditLivestockData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  console.log("Raiser Details: ", raiser);

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
    // 1️⃣ Fetch healthRecords subcollection
    const healthSnap = await getDocs(
      collection(
        db,
        "raisers",
        raiser.id,
        "livestock",
        livestock.id,
        "healthRecords",
      ),
    );

    const healthRecords = {
      vaccinations: [],
      dewormings: [],
      treatments: [],
      aiRecords: [],
    };

    healthSnap.forEach((docSnap) => {
      const data = docSnap.data();

      if (data.type && healthRecords[data.type]) {
        healthRecords[data.type].push({
          id: docSnap.id, // keep id if needed later
          ...data,
        });
      }
    });

    // 2️⃣ Prepare data for modal (SINGLE livestock)
    setEditLivestockData([
      {
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

      await upsert(livestock.healthRecords.vaccinations, "vaccinations");
      await upsert(livestock.healthRecords.dewormings, "dewormings");
      await upsert(livestock.healthRecords.treatments, "treatments");
      await upsert(livestock.healthRecords.aiRecords, "ai");

      setEditOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

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
          {/* Ownership Details */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1">
            Ownership Details
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
            <div>
              <p className="font-medium text-gray-900">Raiser's Name</p>
              <p>{raiser.raiserName || "—"}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Farm Name</p>
              <p>{raiser.farmName || "—"}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Farm Location</p>
              <p>{raiser.farmLocation || "—"}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Raiser's Barangay</p>
              <p>{raiser.address || "—"}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Contact Number</p>
              <p>{raiser.contactNumber || "—"}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Type of Raiser</p>
              <p>{raiser.typeOfRaiser || "—"}</p>
            </div>
          </div>
          {/* Livestock Information */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1">
            Livestock Information
          </h3>
          {loading ? (
            <p className="text-center text-gray-500">Loading livestock...</p>
          ) : (
            <div className="space-y-4">
              {livestockWithCounts.map((l) => (
                <div
                  key={l.id}
                  className="border rounded-xl p-4 bg-gray-50 relative"
                >
                  {/* Action Icons */}
                  <div className="absolute top-3 right-3 flex gap-3 text-gray-500">
                    <button
                      onClick={() => openEditLivestock(l)}
                      className="hover:text-blue-600"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(l.id)}
                      className="hover:text-red-600"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <p>
                      <strong>Name:</strong> {l.livestockName}
                    </p>
                    <p>
                      <strong>Type:</strong> {l.typeOfAnimal}
                    </p>
                    <p>
                      <strong>Breed:</strong> {l.breed}
                    </p>
                    <p>
                      <strong>Status:</strong> {l.status}
                    </p>
                  </div>

                  <div className="mt-3 text-green-700 font-medium">
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
