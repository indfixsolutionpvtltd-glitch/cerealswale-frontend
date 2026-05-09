import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBRc1nuSgPhGJclWVgmcEE8qOrx1ztoS3k",
  authDomain: "cerealswale.firebaseapp.com",
  databaseURL: "https://cerealswale-default-rtdb.firebaseio.com",
  projectId: "cerealswale",
  storageBucket: "cerealswale.firebasestorage.app",
  messagingSenderId: "26923412223",
  appId: "1:26923412223:web:c758a2e39af5ceb2dbbaca",
  measurementId: "G-JSJP5TBBPG"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export { db };
