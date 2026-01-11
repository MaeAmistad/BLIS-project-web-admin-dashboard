import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const NotifyAllUsers = async ({ message, type }) => {
  const usersSnap = await getDocs(collection(db, "users"));

  // const promises = usersSnap.docs.map((userDoc) =>
  //   addDoc(collection(db, "notifications"), {
  //     userId: userDoc.id, // uid
  //     message,
  //     type,
  //     read: false,
  //     createdAt: serverTimestamp(),
  //   })
  // );

  //await Promise.all(promises);
};
