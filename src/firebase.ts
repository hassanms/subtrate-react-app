import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

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

export const functions = getFunctions(app);
connectFunctionsEmulator(functions, "localhost", 5001);

// Function to request notification permission and get token
export const requestForToken = async (): Promise<string | null> => {
  try {
    const currentToken = await getToken(messaging, { vapidKey: "BENO89-rWDUV1ZiK3UxCKm5_O7XPXrZ7A7GRKsjNEBdfsmg9NOSoefmT69VJZJ_SKPD9zFzj7waTdF5pT5hLTTk" });
    if (currentToken) {
      console.log('Current token for client:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (err: any) {
    if (err.code === 'messaging/permission-blocked') {
      console.error('Notifications are blocked. Please enable them in your browser settings.');
      alert('Notifications are blocked. Please enable them in your browser settings to receive updates.');
    } else {
      console.error('An error occurred while retrieving token: ', err);
    }
    return null;
  }
};

// Function to listen for messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });