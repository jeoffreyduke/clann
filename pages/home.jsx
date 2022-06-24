import React from "react";
import { signOut, useSession } from "next-auth/react";
import Body from "../components/Body";
import styles from "../styles/Home.module.css";
import { Avatar, AvatarGroup } from "@mui/material";
import Header from "../components/Header";

function homeComp() {
  return (
    <>
      <section className={styles.first}>
        <div className={styles.header}>In session</div>
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
      </section>
      <section className={styles.second}>
        <div className={styles.header}>
          Public Sessions You might be interested in
        </div>
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
      </section>
      <section className={styles.third}>
        <div className={styles.header}>Rooms you might be interested in</div>
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
      </section>
    </>
  );
}

function Home() {
  const { data: session, status } = useSession();

  return (
    <>
      <Header />
      <Body midComp={homeComp()} />
    </>
  );
}

export default Home;
