import styles from "../styles/Home.module.css";
import Signin from "./signin";
import Header from "../components/Header";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { handleAllUsers, refreshAllUsers } from "../provider/allUsersSlice";
import { handleAllRooms, refreshAllRooms } from "../provider/allRoomsSlice";
import Home from "./home";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import { createUser, createRoom, clearAllUsers } from "./api/database";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../components/Loading";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);
const userRef = ref(db, "users/");
const roomRef = ref(db, "rooms/");

export default function Index() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const dispatch = useDispatch();
  const selector = useSelector(handleAllUsers);
  const allUsers = selector.payload.allUsersSlice.value;
  const allRooms = selector.payload.allRoomsSlice.value;

  const [deviceWidth, setDeviceWidth] = useState(0);

  useEffect(() => {
    //clearAllUsers();
    dispatch(refreshAllUsers());
    dispatch(refreshAllRooms());
    onValue(userRef, (snapshot) => {
      dispatch(handleAllUsers(snapshot.val()));
    });
    onValue(roomRef, (snapshot) => {
      dispatch(handleAllRooms(snapshot.val()));
    });
  }, [dispatch]);

  // set listener for device width change, then reload page if device width changes
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => {
        setDeviceWidth(window.innerWidth);
      },
      false
    );
  }, [deviceWidth]);

  if (error) {
    return <p>{error}</p>;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Home / Clann</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      {user ? <Home /> : <Signin />}
    </div>
  );
}
