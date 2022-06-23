import styles from "../styles/Home.module.css";
import Signin from "./signin";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { handleAllUsers, refreshAllUsers } from "../provider/allUsersSlice";
import { refreshAuth } from "../provider/authSlice";
import { useSession } from "next-auth/react";
import Home from "./home";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import { createUser, createRoom } from "./api/database";
import { useEffect, useState } from "react";

export const firebaseConfig = {
  apiKey: "AIzaSyDI4J_cygaTFClHNVmHdPtJHy2uTUh3-u0",
  authDomain: "clann-web.firebaseapp.com",
  databaseURL: "https://clann-web-default-rtdb.firebaseio.com",
  projectId: "clann-web",
  storageBucket: "clann-web.appspot.com",
  messagingSenderId: "310101668106",
  appId: "1:310101668106:web:8977644b0555887ff74af3",
  measurementId: "G-MNJR2E2C0P",
};

export const app = initializeApp(firebaseConfig);
const db = getDatabase();
export const auth = getAuth(app);

const userRef = ref(db, "users/");

export let users;

export default function Index() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const selector = useSelector(handleAllUsers);
  const allUsers = selector.payload.allUsersSlice.value;
  const auth = selector.payload.authSlice.value;

  useEffect(() => {
    dispatch(refreshAuth());
    dispatch(refreshAllUsers());
    onValue(userRef, (snapshot) => {
      dispatch(handleAllUsers(snapshot.val()));
    });
  }, [dispatch]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      {!auth ? (
        <>
          <Signin />
        </>
      ) : (
        <>
          <Header />
          <Home />
        </>
      )}
    </div>
  );
}
