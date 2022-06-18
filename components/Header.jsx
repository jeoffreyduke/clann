import React from "react";
import Image from "next/image";
import styles from "../styles/Header.module.css";
import { Avatar } from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";

function Header({ profilePic }) {
  return (
    <header className={styles.Header}>
      <div className={styles.logo}>
        <Image
          src="/../public/assets/logonamelight.png"
          alt="logo"
          height={150}
          width={150}
        />
      </div>
      <div className={styles.search}>
        <input
          type="search"
          name=""
          id=""
          placeholder="What are you looking for, Preye?"
        />
        <button>
          <SearchOutlinedIcon
            sx={{
              width: "20px",
              height: "20px",
              position: "relative",
              top: "0.2rem",
            }}
          />
        </button>
        <div className={styles.btn}></div>
      </div>
      <div className={styles.profile}>
        <NotificationsNoneOutlinedIcon
          sx={{ color: "#707070", position: "relative", top: "0.5rem" }}
        />
        <MessageOutlinedIcon
          sx={{ color: "#707070", position: "relative", top: "0.5rem" }}
        />
        <BusinessOutlinedIcon
          sx={{ color: "#707070", position: "relative", top: "0.5rem" }}
        />
        <Avatar alt="profile Picture" src={profilePic} />
      </div>
    </header>
  );
}

export default Header;
