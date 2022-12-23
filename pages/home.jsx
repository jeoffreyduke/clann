import React, { useState, useEffect } from "react";
import Link from "next/link";
import { firebaseConfig } from ".";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { handleAllRooms } from "../provider/allRoomsSlice";
import { addUserToRoom, createNotification } from "./api/database";
import { updateUserNotifications } from "../provider/allUsersSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import Body from "../components/Body";
import styles from "../styles/Home.module.css";
import { Avatar, AvatarGroup, formLabelClasses } from "@mui/material";
import date from "date-and-time";
import Header from "../components/Header";
import { onValue, ref, getDatabase } from "firebase/database";
import Head from "next/head";

export function HomeComp() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const selector = useSelector(handleAllRooms);
  const rooms = selector.payload.allRoomsSlice.value;
  const users = selector.payload.allUsersSlice.value;
  const user = selector.payload.userSlice.value;
  const [userData, loading, error] = useAuthState(auth);
  const [isMobile, setIsMobile] = useState(false);

  const now = new Date();
  const pattern = date.compile("MMM, DD YYYY");

  const handleAddUser = (id) => {
    addUserToRoom(
      userData.uid,
      user.name,
      user.username,
      user.email,
      user.password,
      user.date,
      user.profile_pic,
      date.format(now, pattern),
      id
    );

    // notify the creator of the room
    Object.keys(users).forEach((key) => {
      if (
        users[key].name === rooms[id]?.createdBy.name &&
        key !== userData.uid
      ) {
        createNotification(key, ` just entered your room.`, user, false);

        const db = getDatabase();
        const notifsRef = ref(db, "users/" + `${key}/notifications`);

        onValue(notifsRef, (snapshot) => {
          dispatch(
            updateUserNotifications({
              userId: key,
              notifications: snapshot.val(),
            })
          );
        });
      }
    });
  };

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.innerWidth]);

  return (
    <>
      <Head>
        <title>Home / Vibe</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className={styles.first}>
        <div className={styles.header}>In session</div>
        <div className={styles.roomBox}>
          <div className={styles.roomTitle}>Not in session</div>
          <div className={styles.roomName}>Mental Health</div>
          <div className={styles.roomUsers}>
            {!users ? (
              <div className={styles.noUsers}>No users</div>
            ) : (
              <AvatarGroup
                className={styles.AvatarGroup}
                max={3}
                total={Object.keys(users).length}
              >
                {Object.keys(users).map((user) => (
                  <Avatar
                    key={user + Math.random()}
                    alt={users[user].name}
                    src={users[user].profile_pic}
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
            <button disabled={true}>Locked</button>
          </div>
        </div>
      </section>

      <section className={styles.second}>
        {!rooms ? (
          ""
        ) : (
          <div className={styles.header}>
            Public Sessions You might be interested in
          </div>
        )}

        {!rooms
          ? ""
          : Object.keys(rooms).map((room) => (
              <div
                className={styles.roomBox}
                key={Math.random() + rooms[room].name}
              >
                <div className={styles.roomTitle}>
                  {rooms[room].inSession ? "In session" : "Not in session"}
                </div>
                <div className={styles.roomName}>{rooms[room].name}</div>
                <div className={styles.roomUsers}>
                  {!users ? (
                    <div className={styles.noUsers}>No users</div>
                  ) : (
                    <AvatarGroup
                      className={styles.AvatarGroup}
                      max={3}
                      total={
                        rooms[room].users
                          ? Object?.keys(rooms[room].users).length
                          : 0
                      }
                    >
                      {!rooms[room].users
                        ? ""
                        : Object?.keys(rooms[room].users).map((user) => (
                            <Avatar
                              key={user + Math.random()}
                              alt={users[user]?.name}
                              src={users[user]?.profile_pic}
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
                  <Link href={`/room/${room}`}>
                    <button
                      disabled={
                        rooms[room].inSession === false &&
                        rooms[room]?.createdBy.name !== user.name
                          ? true
                          : false
                      }
                      onClick={() => handleAddUser(room)}
                    >
                      {rooms[room].inSession === false &&
                      rooms[room]?.createdBy.name !== user.name
                        ? "Locked"
                        : "Enter"}
                    </button>
                  </Link>
                </div>
              </div>
            ))}
      </section>

      <section className={styles.third}>
        <div className={styles.header}>Rooms you might be interested in</div>
        <div className={styles.roomBox}>
          <div className={styles.roomTitle}>Not in session</div>
          <div className={styles.roomName}>Gamblers Anonymous</div>
          <div className={styles.roomUsers}>
            {!users ? (
              <div className={styles.noUsers}>No users</div>
            ) : (
              <AvatarGroup
                className={styles.AvatarGroup}
                max={3}
                total={Object.keys(users).length}
              >
                {Object.keys(users).map((user) => (
                  <Avatar
                    key={user + Math.random()}
                    alt={users[user].name}
                    src={users[user].profile_pic}
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
            <button disabled={true}>Locked</button>
          </div>
        </div>

        <div className={styles.roomBox}>
          <div className={styles.roomTitle}>Not in session</div>
          <div className={styles.roomName}>Mental Health</div>
          <div className={styles.roomUsers}>
            {!users ? (
              <div className={styles.noUsers}>No users</div>
            ) : (
              <AvatarGroup
                className={styles.AvatarGroup}
                max={3}
                total={Object.keys(users).length}
              >
                {Object.keys(users).map((user) => (
                  <Avatar
                    key={user + Math.random()}
                    alt={users[user].name}
                    src={users[user].profile_pic}
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
            <button disabled={true}>Locked</button>
          </div>
        </div>
      </section>
    </>
  );
}

function Home() {
  return (
    <>
      <Header />
      <Body midComp={<HomeComp />} />
    </>
  );
}

export default Home;
