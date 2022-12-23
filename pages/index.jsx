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
import {
  createUser,
  createRoom,
  clearAllUsers,
  deleteUser,
} from "./api/database";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../components/Loading";

export const firebaseConfig = {
  apiKey: "AIzaSyCZDi1sxQ5X6Rcii5tUc2fzRR4b058YI1E",
  authDomain: "vibe-292ba.firebaseapp.com",
  databaseURL: "https://vibe.arvrtise.com",
  projectId: "vibe-292ba",
  storageBucket: "vibe-292ba.appspot.com",
  messagingSenderId: "399348267188",
  appId: "1:399348267188:web:3e052912354e0879e0ffe1",
  measurementId: "G-8C0WQJ0TH4",
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
  const background = selector.payload.darkSlice.value;

  const [deviceWidth, setDeviceWidth] = useState(0);

  useEffect(() => {
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

  useEffect(() => {
    if (background) {
      document.body.classList.add("bodyDark");
    } else {
      document.body.classList.remove("bodyDark");
    }
  }, [background]);

  if (error) {
    return <p>{error}</p>;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Home / Vibe</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      {user ? <Home /> : <Signin />}
    </div>
  );
}
