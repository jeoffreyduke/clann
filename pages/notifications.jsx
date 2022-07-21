import React, { useEffect } from "react";
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

  return (
    <div className={styles.Notifications}>
      <header>Notifications</header>
      <div className={styles.notifications}>
        {user.notifications &&
          Object.values(user.notifications)
            .reverse()
            .map((notif) => {
              return notif.notification.includes("your room.") ||
                notif.notification.includes("in session") ||
                notif.notification.includes("invited") ? (
                <div
                  className={styles.notification}
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
                          />
                        ) : (
                          <OtherHousesRoundedIcon
                            fontSize="large"
                            sx={{
                              color: "#8c52ff",
                              height: "42px",
                              width: "42px",
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
                            onClick={() => router.push(`/room/${notif.roomId}`)}
                          >
                            Accept
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
            })}
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
