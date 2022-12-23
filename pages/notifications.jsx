import React, { useEffect, useState } from "react";
import Body from "../components/Body";
import Header from "../components/Header";
import styles from "../styles/Notifications.module.css";
import { firebaseConfig } from "./index";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, getDatabase, onValue } from "firebase/database";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { handleUser, updateNotifications } from "../provider/userSlice";
import { updateSeen } from "./api/database";
import { Avatar } from "@mui/material";
import OtherHousesRoundedIcon from "@mui/icons-material/OtherHousesRounded";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import noNotification from "../public/assets/no-notification.svg"
function NotifComp() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const [User] = useAuthState(auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const selector = useSelector(handleUser);
  const rooms = selector.payload.allRoomsSlice.value;
  const user = selector.payload.userSlice.value;
  const users = selector.payload.allUsersSlice.value;
  const background = selector.payload.darkSlice.value;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (router.isReady && User) {
      dispatch(updateNotifications(users[User?.uid].notifications));
      // update the seen field in the database for all the notifications
      if (user.notifications) {
        Object.keys(user.notifications).forEach((key) => {
          updateSeen(User?.uid, key);
        });
      }
    }
  }, [dispatch, User, users, router.isReady, user.notifications]);

  useEffect(() => {
    if (window.innerWidth <= 900) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.innerWidth]);

  useEffect(() => {
    if (background) {
      document.body.classList.add("bodyDark");
    } else {
      document.body.classList.remove("bodyDark");
    }
  }, [background]);

  return (
    <div className={styles.Notifications}>
      <Head>
        <title>Notifications / Vibe</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>Notifications</header>
      <div
        className={styles.notifications}
        id={background === true ? styles.notificationsDark : null}
        style={{ border: !user.notifications && 0 }}
      >
        {user.notifications ?
          Object.values(user.notifications)
            .reverse()
            .map((notif) => {
              return notif.notification.includes("your room.") ||
                notif.notification.includes("in session") ||
                notif.notification.includes("invited") ? (
                <div
                  className={styles.notification}
                  id={background === true ? styles.notificationDark : null}
                  key={Math.random() + notif}
                >
                  <Link
                    href={
                      (notif.notification.includes("your room.") &&
                        `/user/${notif.data?.username}`) ||
                      (notif.notification.includes("in session") &&
                        `/room/${notif.roomId}`) ||
                      (notif.notification.includes("invited") && ``)
                    }
                  >
                    <div>
                      <div className={styles.notificationsAvatar}>
                        {!notif.notification.includes("in session") ? (
                          <Avatar
                            src={notif.data?.profile_pic}
                            alt={notif.data?.name}
                            sx={{
                              height: isMobile ? "26px" : null,
                              width: isMobile ? "26px" : null,
                            }}
                          />
                        ) : (
                          <OtherHousesRoundedIcon
                            fontSize="large"
                            sx={{
                              color: "#8c52ff",
                              height: isMobile ? "26px" : "42px",
                              width: isMobile ? "26px" : "42px",
                            }}
                          />
                        )}
                      </div>
                      <div className={styles.notificationMsg}>
                        <span>{notif.data?.name}</span>
                        {notif.notification}
                      </div>

                      {notif.notification.includes("invited") ? (
                        <div className={styles.enterBtn}>
                          <button
                            disabled={
                              !rooms[notif.roomId]?.inSession === false &&
                                rooms[notif.roomId]?.createdBy.name !== User.name
                                ? true
                                : false
                            }
                            onClick={() => router.push(`/room/${notif.roomId}`)}
                          >
                            {!rooms[notif.roomId]?.inSession === false &&
                              rooms[notif.roomId]?.createdBy.name !== User.name
                              ? "Locked"
                              : "Enter"}
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </Link>
                </div>
              ) : (
                ""
              );
            }) : (
            <>
              <p className={`${styles.noNotifyText}`} id={background === true ? styles.notificationsDark : null}>
                You have no notifications
              </p>
              <div className={styles.noNotification}>
                <Image src={noNotification} alt='No notification' />
              </div>
            </>
          )
        }
      </div>

    </div>
  );
}

function Notifications() {
  return (
    <>
      <Header />
      <Body midComp={<NotifComp />} />
    </>
  );
}

export default Notifications;
