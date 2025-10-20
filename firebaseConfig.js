// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwRTl6TAgaf7q7TT1GG4DUFzq15brjQmU",
  authDomain: "invest-facil-app.firebaseapp.com",
  projectId: "invest-facil-app",
  storageBucket: "invest-facil-app.firebasestorage.app",
  messagingSenderId: "514050286137",
  appId: "1:514050286137:web:0779e803160c57d56263e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };