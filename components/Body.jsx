import React from "react";
import Link from "next/link";
import styles from "../styles/Body.module.css";
import { signOut, useSession } from "next-auth/react";
import { Avatar } from "@mui/material";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";

function Body({ profilePic, midComp }) {
  const { data: session, status } = useSession();

  return (
    <div className={styles.Body}>
      <nav className={styles.nav}>
        <div className={styles.options}>
          <ul>
            <li>
              <Link href="/">
                <a className={styles.active}>Create</a>
              </Link>
            </li>
            <li>
              <Link href="/discover">
                <a className={styles.active}>Discover</a>
              </Link>
            </li>
            <li>
              <Link href="/favorites">
                <a className={styles.active}>Favorites</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.rooms}>
          <p className={styles.roomsTitle}>Rooms</p>
          <ul>
            <li>Alcholics</li>
            <li>Ipsum</li>
            <li>Lorem</li>
          </ul>
        </div>
        <div className={styles.copyright}>© 2022 Clann</div>
      </nav>
      <main className={styles.main}>{midComp}</main>
      <aside className={styles.aside}>
        <div onClick={() => signOut()}>
          <ExitToAppRoundedIcon
            sx={{
              height: "45px",
              width: "45px",
            }}
          />
        </div>
        <div className={styles.userPic}>
          <Avatar
            alt="profile Picture"
            src={profilePic}
            sx={{
              height: "42px",
              width: "42px",
            }}
          />
        </div>
      </aside>
    </div>
  );
}

export default Body;
