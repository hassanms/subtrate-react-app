import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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

// Function to request notification permission and get token
export const requestForToken = () => {
  return getToken(messaging, { vapidKey: "BENO89-rWDUV1ZiK3UxCKm5_O7XPXrZ7A7GRKsjNEBdfsmg9NOSoefmT69VJZJ_SKPD9zFzj7waTdF5pT5hLTTk" })
    .then((currentToken) => {
      if (currentToken) {
        console.log('Current token for client:', currentToken);
        // Send the token to your server and update the UI if necessary
      } else {
        console.log('No registration token available.');
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
};

// Function to listen for messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });