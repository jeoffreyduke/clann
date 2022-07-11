import React, { useEffect } from "react";
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

function FavComp() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const [userr] = useAuthState(auth);
  const selector = useSelector(handleUser);
  const rooms = selector.payload.allRoomsSlice.value;
  const user = selector.payload.userSlice.value;
  const router = useRouter();
  {
    /*useEffect(() => {
    

    for (const key in rooms) {
      console.log(
        Object.keys(user?.favorites).filter((favId) => key === favId)
      );
    }
  }, []);*/
  }

  return (
    <>
      <div>
        {user && !user?.favorites ? (
          <p>No rooms yet</p>
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
                    max={3}
                    total={Object.keys(rooms[room]?.users).length}
                  >
                    {Object.keys(rooms[room]?.users).map((user) => (
                      <Avatar
                        key={user + Math.random()}
                        alt={rooms[room]?.users[user].name}
                        src={rooms[room]?.users[user].profile_pic}
                      />
                    ))}
                  </AvatarGroup>
                )}
              </div>
              <div className={styles.roomJoin}>
                <Link href={`/room/${room}`}>
                  <button>Enter</button>
                </Link>
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
