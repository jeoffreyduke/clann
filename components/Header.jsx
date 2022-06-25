import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { handleUser } from "../provider/userSlice";
import Image from "next/image";
import styles from "../styles/Header.module.css";
import { signOut, useSession } from "next-auth/react";
import { Avatar } from "@mui/material";
import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";

function Header() {
  const { data: session, status } = useSession();
  const selector = useSelector(handleUser);
  const user = selector.payload.userSlice.value;

  return (
    <header className={styles.Header}>
      <div className={styles.headerCon}>
        <div className={styles.logo}>
          <Image
            src="/../public/assets/clann/3.png"
            alt="logo"
            height={250}
            width={250}
          />
        </div>
        <div className={styles.search}>
          <div className={styles.btn}>
            <SearchOutlinedIcon
              sx={{
                color: "#707070",
                width: "20px",
                height: "20px",
                position: "relative",
                top: "0.3rem",
                left: "1rem",
              }}
            />
          </div>
          <input
            type="search"
            name=""
            id=""
            placeholder={`Looking for a room, ${user.name}?`}
          />
        </div>
        <div className={styles.profile}>
          <WhatshotOutlinedIcon
            fontSize="small"
            sx={{ color: "#707070", position: "relative", top: "0.7rem" }}
          />
          <NotificationsNoneOutlinedIcon
            fontSize="small"
            sx={{ color: "#707070", position: "relative", top: "0.7rem" }}
          />
          <GroupsOutlinedIcon
            sx={{ color: "#707070", position: "relative", top: "0.7rem" }}
          />
          <Link href="/favorites">
            <OtherHousesOutlinedIcon
              fontSize="small"
              sx={{ color: "#707070", position: "relative", top: "0.7rem" }}
            />
          </Link>

          <Avatar
            alt={user.name}
            src={user.profile_pic}
            sx={{
              height: "28px",
              width: "28px",
              position: "relative",
              top: "0.4rem",
              left: "0.3rem",
            }}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
