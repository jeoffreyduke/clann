import React, { useContext } from "react";
import Link from "next/link";
import { firebaseConfig } from ".";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { handleAllRooms } from "../provider/allRoomsSlice";
import { addUserToRoom } from "./api/database";
import { useDispatch, useSelector } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut, useSession } from "next-auth/react";
import Body from "../components/Body";
import styles from "../styles/Home.module.css";
import { Avatar, AvatarGroup } from "@mui/material";
import Header from "../components/Header";

export function HomeComp() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const selector = useSelector(handleAllRooms);
  const rooms = selector.payload.allRoomsSlice.value;
  const users = selector.payload.allUsersSlice.value;
  const user = selector.payload.userSlice.value;
  const [userData, loading, error] = useAuthState(auth);

  const handleAddUser = (id) => {
    addUserToRoom(
      userData.uid,
      user.name,
      user.username,
      user.email,
      user.password,
      user.date,
      user.profile_pic,
      id
    );
    console.log(user.name + " added");
  };

  return (
    <>
      <section className={styles.first}>
        <div className={styles.header}>In session</div>
        <div className={styles.roomBox}>
          <div className={styles.roomTitle}>In session</div>
          <div className={styles.roomName}>Alcoholics Anonymous</div>
          <div className={styles.roomUsers}>
            {!users ? (
              <div className={styles.noUsers}>No users</div>
            ) : (
              <AvatarGroup max={3} total={Object.keys(users).length}>
                {Object.keys(users).map((user) => (
                  <Avatar
                    key={user + Math.random()}
                    alt={users[user].name}
                    src={users[user].profile_pic}
                  />
                ))}
              </AvatarGroup>
            )}
          </div>
          <div className={styles.roomJoin}>
            <button>Enter</button>
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
                <div className={styles.roomTitle}>In session</div>
                <div className={styles.roomName}>{rooms[room].name}</div>
                <div className={styles.roomUsers}>
                  {!users ? (
                    <div className={styles.noUsers}>No users</div>
                  ) : (
                    <AvatarGroup
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
                            />
                          ))}
                    </AvatarGroup>
                  )}
                </div>
                <div className={styles.roomJoin}>
                  <Link href={`/room/${room}`}>
                    <button onClick={() => handleAddUser(room)}>Enter</button>
                  </Link>
                </div>
              </div>
            ))}
      </section>

      <section className={styles.third}>
        <div className={styles.header}>Rooms you might be interested in</div>
        <div className={styles.roomBox}>
          <div className={styles.roomTitle}>In session</div>
          <div className={styles.roomName}>Gamblers Anonymous</div>
          <div className={styles.roomUsers}>
            {!users ? (
              <div className={styles.noUsers}>No users</div>
            ) : (
              <AvatarGroup max={3} total={Object.keys(users).length}>
                {Object.keys(users).map((user) => (
                  <Avatar
                    key={user + Math.random()}
                    alt={users[user].name}
                    src={users[user].profile_pic}
                  />
                ))}
              </AvatarGroup>
            )}
          </div>
          <div className={styles.roomJoin}>
            <button>Enter</button>
          </div>
        </div>

        <div className={styles.roomBox}>
          <div className={styles.roomTitle}>In session</div>
          <div className={styles.roomName}>Alcoholics Anonymous</div>
          <div className={styles.roomUsers}>
            {!users ? (
              <div className={styles.noUsers}>No users</div>
            ) : (
              <AvatarGroup max={3} total={Object.keys(users).length}>
                {Object.keys(users).map((user) => (
                  <Avatar
                    key={user + Math.random()}
                    alt={users[user].name}
                    src={users[user].profile_pic}
                  />
                ))}
              </AvatarGroup>
            )}
          </div>
          <div className={styles.roomJoin}>
            <button>Enter</button>
          </div>
        </div>
      </section>
    </>
  );
}

function Home() {
  const { data: session, status } = useSession();

  return (
    <>
      <Header />
      <Body midComp={<HomeComp />} />
    </>
  );
}

export default Home;
