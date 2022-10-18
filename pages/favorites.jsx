import React, { useEffect, useState } from "react";
import styles from "../styles/Favorites.module.css";
import Header from "../components/Header";
import Body from "../components/Body";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { firebaseConfig } from "../pages";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { handleUser } from "../provider/userSlice";
import { Avatar, AvatarGroup } from "@mui/material";
import Head from "next/head";
import Image from "next/image";

function NoRoomsYet() {
  return (
    <div className={styles.noRoomsYet}>
      <div className={styles.con}>
        <div className={styles.noRoomsYetImg}>
          <Image
            src="/assets/waiting.svg"
            alt="No rooms yet"
            width={300}
            height={300}
          />
        </div>
        <div className={styles.noRoomsYetText}>
          You do not have any favorites yet.
        </div>
      </div>
    </div>
  );
}

function FavComp() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const [userr] = useAuthState(auth);
  const selector = useSelector(handleUser);
  const rooms = selector.payload.allRoomsSlice.value;
  const user = selector.payload.userSlice.value;
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 900) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.innerWidth]);

  return (
    <>
      <Head>
        <title>Favorites / Clann</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.Favorites}>
        {user && !user?.favorites ? (
          <NoRoomsYet />
        ) : (
          Object.keys(user?.favorites).map((room) => (
            <div
              className={styles.roomBox}
              key={Math.random() + rooms[room]?.name}
            >
              <div className={styles.roomTitle}>
                {rooms[room]?.inSession ? "In session" : "Not in session"}
              </div>
              <div className={styles.roomName}>{rooms[room]?.name}</div>
              <div className={styles.roomUsers}>
                {!rooms[room]?.users ? (
                  ""
                ) : (
                  <AvatarGroup
                    className={styles.AvatarGroup}
                    max={3}
                    total={Object.keys(rooms[room]?.users).length}
                  >
                    {Object.keys(rooms[room]?.users).map((user) => (
                      <Avatar
                        key={user + Math.random()}
                        alt={rooms[room]?.users[user].name}
                        src={rooms[room]?.users[user].profile_pic}
                        sx={{
                          height: isMobile ? "26px" : "50px",
                          width: isMobile ? "26px" : "50px",
                        }}
                      />
                    ))}
                  </AvatarGroup>
                )}
              </div>
              <div className={styles.roomJoin}>
                {rooms[room]?.inSession === false &&
                rooms[room]?.createdBy.name !== user.name ? (
                  <button>Locked</button>
                ) : (
                  <Link href={`/room/${room}`}>
                    <button>Enter</button>
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

function Favorites() {
  return (
    <>
      <Header />
      <Body midComp={<FavComp />} />
    </>
  );
}

export default Favorites;
