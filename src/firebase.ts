import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6oC3I0FetC-X-WaCnMzcj8Meo-sJM_r8",
  authDomain: "subtrate-apps.firebaseapp.com",
  projectId: "subtrate-apps",
  storageBucket: "subtrate-apps.appspot.com",
  messagingSenderId: "1033824109481",
  appId: "1:1033824109481:web:27b56ab8d4bc2cbeaafab8",
  measurementId: "G-K2EQ5CW0EK"
};

// Initialize Firebase and export the necessary modules
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);