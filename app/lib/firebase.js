import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; // Naya import

const firebaseConfig = {
  apiKey: "AIzaSyBRc1nuSgPhGJclWVgmcEE8qOrx1ztoS3k",
  authDomain: "cerealswale.firebaseapp.com",
  projectId: "cerealswale",
  storageBucket: "cerealswale.firebasestorage.app",
  messagingSenderId: "269234122223",
  appId: "1:269234122223:web:c758a2e39af5ceb2dbbaca",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app); // Storage initialize kiya

export { db, storage };
