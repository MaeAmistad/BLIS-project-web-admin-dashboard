// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArn8NHC_FsSVnnp7cXugl-7G_atf1qEA8",
  authDomain: "bl-inventory-system.firebaseapp.com",
  projectId: "bl-inventory-system",
  storageBucket: "bl-inventory-system.firebasestorage.app",
  messagingSenderId: "590114510781",
  appId: "1:590114510781:web:0e88ef271bed74411264d4",
  measurementId: "G-3DREHEJHK8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// create a secondary app
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
export const secondaryAuth = getAuth(secondaryApp);

