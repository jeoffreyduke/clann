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
import { handleUser } from "../provider/userSlice";
import { updateUserNotifications } from "../provider/allUsersSlice";
import { updateNotifications } from "../provider/userSlice";
import { Avatar } from "@mui/material";
import OtherHousesRoundedIcon from "@mui/icons-material/OtherHousesRounded";

function FavComp() {
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
    if (router.isReady) {
      dispatch(updateNotifications(users[User.uid].notifications));
    }
  }, [dispatch, User, users, router.isReady]);

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
                  <div>
                    <div className={styles.notificationsAvatar}>
                      {!notif.notification.includes("in session") ? (
                        <Avatar
                          src={notif.data?.profile_pic}
                          alt={notif.data?.name}
                          onClick={() =>
                            router.push(`/user/${notif.data?.username}`)
                          }
                        />
                      ) : (
                        <OtherHousesRoundedIcon
                          fontSize="large"
                          sx={{
                            color: "#8c52ff",
                            height: "42px",
                            width: "42px",
                          }}
                          onClick={() => router.push(`/user/${notif.roomId}`)}
                        />
                      )}
                    </div>
                    <div className={styles.notificationMsg}>
                      <span>{notif.data?.name}</span>
                      {notif.notification}
                    </div>
                  </div>

                  {notif.notification.includes("invited") ? (
                    <div className={styles.enterBtn}>
                      <button
                        onClick={() => router.push(`/user/${notif.data}`)}
                      >
                        Accept
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
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
      <Body midComp={<FavComp />} />
    </>
  );
}

export default Notifications;
