import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBRc1nuSgPhGJclWVgmcEE8qOrx1ztoS3k",
  authDomain: "cerealswale.firebaseapp.com",
  projectId: "cerealswale",
  storageBucket: "cerealswale.firebasestorage.app",
  messagingSenderId: "269234122223", // Maine ise theek kar diya hai
  appId: "1:269234122223:web:c758a2e39af5ceb2dbbaca",
  measurementId: "G-JSJP5TBBPG"
};

// Initialize Firebase (Next.js Friendly Version)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
