// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, ref } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDI4J_cygaTFClHNVmHdPtJHy2uTUh3-u0",
  authDomain: "clann-web.firebaseapp.com",
  databaseURL: "https://clann-web-default-rtdb.firebaseio.com",
  projectId: "clann-web",
  storageBucket: "clann-web.appspot.com",
  messagingSenderId: "310101668106",
  appId: "1:310101668106:web:8977644b0555887ff74af3",
  measurementId: "G-MNJR2E2C0P",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getDatabase();
export const userRef = ref(db, "users/" + userId);
export default app;
