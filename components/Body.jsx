import React, { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { handleUser, refreshUser } from "../provider/userSlice";
import Link from "next/link";
import styles from "../styles/Body.module.css";
import { firebaseConfig } from "../pages";
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { Avatar } from "@mui/material";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";

function Body({ profilePic, midComp }) {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const selector = useSelector(handleUser);
  const rooms = selector.payload.allRoomsSlice.value;
  const user = selector.payload.userSlice.value;
  const router = useRouter();

  const [createActive, setCreateActive] = useState(true);
  const [disActive, setDisActive] = useState(false);
  const [favActive, setFavActive] = useState(false);

  const switchCreate = () => {
    setCreateActive(true);
    setDisActive(false);
    setFavActive(false);
    console.log("create");
  };

  const switchDiscover = () => {
    setDisActive(true);
    setCreateActive(false);
    setFavActive(false);
    console.log("discover");
  };

  const switchFav = () => {
    setFavActive(true);
    setCreateActive(false);
    setDisActive(false);
    console.log("fav");
  };

  const handleSignOut = () => {
    dispatch(refreshUser());
    signOut(auth);
    router.push("/");
  };

  const trimName = (name) => {
    if (name.length > 10) {
      return name.substring(0, 10) + "...";
    } else return name;
  };

  return (
    <div className={styles.Body}>
      <nav className={styles.nav}>
        <div className={styles.options}>
          <ul>
            <li>
              <Link href="/home">
                <a className={styles.link}>Home</a>
              </Link>
            </li>
            <li>
              <Link href="/create">
                <a className={styles.link}>Create</a>
              </Link>
            </li>
            <li>
              <Link href="/favorites">
                <a className={styles.link}>Favorites</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.rooms}>
          <p className={styles.roomsTitle}>Rooms</p>
          <ul>
            {!rooms
              ? ""
              : Object.keys(rooms).map((room) => (
                  <li key={room + Math.random()}>
                    <Link href={`/room/${room}`}>
                      <a className={styles.linkLittle}>
                        {trimName(rooms[room].name)}
                      </a>
                    </Link>
                  </li>
                ))}
          </ul>
        </div>
        <div className={styles.copyright}>© 2022 Clann</div>
      </nav>
      <main className={styles.main}>{midComp}</main>
      <aside className={styles.aside}>
        <div onClick={handleSignOut}>
          <ExitToAppRoundedIcon
            sx={{
              height: "45px",
              width: "45px",
            }}
          />
        </div>
        <div className={styles.userPic}>
          <Avatar
            alt="profile Picture"
            src={user.profile_pic}
            sx={{
              height: "42px",
              width: "42px",
            }}
          />
        </div>
      </aside>
    </div>
  );
}

export default Body;
