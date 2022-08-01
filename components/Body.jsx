import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { handleUser, refreshUser } from "../provider/userSlice";
import Link from "next/link";
import styles from "../styles/Body.module.css";
import { firebaseConfig } from "../pages";
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { Avatar } from "@mui/material";
import { trimName } from "../customHooks/trimName";
import Tooltip from "@mui/material/Tooltip";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";

function Body({ midComp }) {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const selector = useSelector(handleUser);
  const rooms = selector.payload.allRoomsSlice.value;
  const user = selector.payload.userSlice.value;
  const router = useRouter();

  // check if the screen is a mobile screen
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.innerWidth]);

  const handleSignOut = () => {
    dispatch(refreshUser());
    signOut(auth);
    router.push("/");
  };

  return (
    <div className={styles.Body}>
      <nav className={styles.nav}>
        <div className={styles.options}>
          <ul>
            <li>
              <Link href="/home">
                <a
                  className={
                    router.pathname == "/" || router.pathname == "/home"
                      ? styles.active
                      : styles.link
                  }
                >
                  Home
                </a>
              </Link>
            </li>
            <li>
              <Link href="/create">
                <a
                  className={
                    router.pathname == "/create" ? styles.active : styles.link
                  }
                >
                  Create
                </a>
              </Link>
            </li>
            <li>
              <Link href="/favorites">
                <a
                  id={styles.fav}
                  className={
                    router.pathname == "/favorites"
                      ? styles.active
                      : styles.link
                  }
                >
                  Favorites
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.rooms}>
          <p className={styles.roomsTitle}>Rooms</p>
          <ul>
            {user && !user?.favorites ? (
              <p>No rooms yet</p>
            ) : (
              Object.keys(user?.favorites).map((room) => (
                <li key={room + Math.random()}>
                  <Link
                    href={
                      rooms[room]?.inSession === false &&
                      rooms[room]?.createdBy.name !== user.name
                        ? ""
                        : `/room/${room}`
                    }
                  >
                    <a className={styles.linkLittle}>
                      {trimName(rooms[room]?.name, 10)}
                    </a>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className={styles.copyright}>© 2022 Clann</div>
      </nav>
      <main className={styles.main}>{midComp}</main>
      <aside className={styles.aside}>
        <div onClick={handleSignOut} className={styles.leave}>
          <Tooltip title="Sign Out" arrow placement="right">
            <ExitToAppRoundedIcon
              sx={{
                height: "45px",
                width: "45px",
              }}
            />
          </Tooltip>
        </div>
        <div className={styles.userPic}>
          <Link href={`/user/${user.username}`}>
            <Avatar
              alt={user.name}
              src={user.profile_pic}
              sx={{
                height: "42px",
                width: "42px",
              }}
            />
          </Link>
        </div>
      </aside>
    </div>
  );
}

export default Body;
