import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import toggleHelper from "../customHooks/toggleHelper";
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
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function Header() {
  const { data: session, status } = useSession();
  const selector = useSelector(handleUser);
  const user = selector.payload.userSlice.value;
  const [drop, setDrop] = useState(false);

  const handleDrop = () => {
    setDrop(!drop);
  };

  const dropRef = useRef(null);
  const [listening, setListening] = useState(false);
  /* eslint-disable */
  useEffect(toggleHelper(listening, setListening, dropRef, setDrop));

  return (
    <div ref={dropRef} onClick={drop ? () => setDrop(false) : () => {}}>
      <header className={styles.Header}>
        <div className={styles.headerCon}>
          <Link href="/">
            <div className={styles.logo}>
              <Image
                src="/../public/assets/clann/3.png"
                alt="logo"
                height={250}
                width={250}
              />
            </div>
          </Link>
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
            <Link href="/popular">
              <WhatshotOutlinedIcon
                fontSize="small"
                sx={{
                  color: "#707070",
                  position: "relative",
                  top: "0.7rem",
                  left: "0.2rem",
                }}
              />
            </Link>

            <Link href="/notifications">
              <NotificationsNoneOutlinedIcon
                fontSize="small"
                sx={{ color: "#707070", position: "relative", top: "0.7rem" }}
              />
            </Link>

            <Link href="/friends">
              <GroupsOutlinedIcon
                sx={{ color: "#707070", position: "relative", top: "0.7rem" }}
              />
            </Link>

            <Link href="/favorites">
              <OtherHousesOutlinedIcon
                fontSize="small"
                sx={{ color: "#707070", position: "relative", top: "0.7rem" }}
              />
            </Link>

            <div
              className={drop ? styles.pdActive : styles.profileDrop}
              onClick={handleDrop}
            >
              <Avatar
                alt={user.name}
                src={user.profile_pic}
                sx={{
                  height: "28px",
                  width: "28px",
                  position: "relative",
                  top: "0.4rem",
                  right: "0.12rem",
                }}
              />
              <ArrowDropDownIcon
                sx={{
                  color: "#707070",
                  position: "relative",
                  top: "0.55rem",
                  left: "0.45rem",
                }}
              />
            </div>
          </div>
        </div>
      </header>
      <div className={drop ? styles.dropDown : styles.noDrop}>
        <Link href={`/user/${user.username}`}>
          <div className={styles.dropDownItem}>Profile</div>
        </Link>

        <Link href="/settings">
          <div className={styles.dropDownItem}>User settings</div>
        </Link>

        <Link href="/">
          <div className={styles.dropDownItem}>About</div>
        </Link>

        <div className={styles.dropDownItem}>Dark Mode</div>

        <div className={styles.copyRight}>© 2022 Clann</div>
      </div>
    </div>
  );
}

export default Header;
