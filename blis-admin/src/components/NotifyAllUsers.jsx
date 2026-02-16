import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const notifyAllUsers = async ({ title, message, type }) => {
  const usersSnap = await getDocs(collection(db, "users"));

  const writes = usersSnap.docs.map((userDoc) =>
    addDoc(
      collection(db, "users", userDoc.id, "notifications"),
      {
        title,
        message,
        type,          // "add" | "edit"
        read: false,
        createdAt: serverTimestamp(),
         updatedAt: serverTimestamp(),
      }
    )
  );

  await Promise.all(writes);
};
