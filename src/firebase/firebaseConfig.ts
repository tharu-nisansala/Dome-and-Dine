import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD1n0g1PfZhL61dj7qfVYzxvZVdwsX-yWc",
  authDomain: "domedine-7d111.firebaseapp.com",
  projectId: "domedine-7d111",
  storageBucket: "domedine-7d111.appspot.com",
  messagingSenderId: "869051540186",
  appId: "1:869051540186:web:f34a25610c0d8b75f13be3",
  measurementId: "G-ZD0SS2G86D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

// Enable persistence
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Firebase persistence error:", error);
  });

export { db, auth };