// Firebase configuration
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCiwBqjpin4sD9iA0mY46yrsFFeh5dMm9c",
  authDomain: "metaverse-5c533.firebaseapp.com",
  projectId: "metaverse-5c533",
  storageBucket: "metaverse-5c533.firebasestorage.app",
  messagingSenderId: "916636025252",
  appId: "1:916636025252:web:5ae62c3d94f328630ac131"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// List of authorized admin emails
const authorizedEmails = [
  // Add your admin emails here
  "erdkrai04@gmail.com",
  // Add more emails as needed
];

// Function to check if a user is authorized
const isAuthorizedAdmin = (email) => {
  if (!email) return false;
  return authorizedEmails.includes(email.toLowerCase());
};

export { db, auth, isAuthorizedAdmin }; 