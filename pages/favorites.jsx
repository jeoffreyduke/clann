import React from "react";
import styles from "../styles/Favorites.module.css";
import { signOut, useSession } from "next-auth/react";
import Header from "../components/Header";
import Body from "../components/Body";
import { Avatar, AvatarGroup } from "@mui/material";

function favComp() {
  return (
    <>
      <div>
        <div className={styles.roomBox}>
          <div className={styles.roomTitle}>In session</div>
          <div className={styles.roomName}>Alcoholics Anonymous</div>
          <div className={styles.roomUsers}>
            <AvatarGroup max={3} total={126}>
              <Avatar />
              <Avatar />
              <Avatar />
            </AvatarGroup>
          </div>
          <div className={styles.roomJoin}>
            <button>Enter</button>
          </div>
        </div>
      </div>
    </>
  );
}

function Favorites() {
  const { data: session, status } = useSession();

  return (
    <>
      <Header />
      <Body midComp={favComp()} />
    </>
  );
}

export default Favorites;
