import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import toggleHelper from "../customHooks/toggleHelper";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { firebaseConfig } from "../pages/index";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import { handleUser, updateNotifications } from "../provider/userSlice";
import { handleCount, refreshCount } from "../provider/countSlice";
import Image from "next/image";
import styles from "../styles/Header.module.css";
import { signOut, useSession } from "next-auth/react";
import { Avatar } from "@mui/material";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import OtherHousesRoundedIcon from "@mui/icons-material/OtherHousesRounded";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function Header() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const [User] = useAuthState(auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const selector = useSelector(handleUser);
  const user = selector.payload.userSlice.value;
  const users = selector.payload.allUsersSlice.value;
  const rooms = selector.payload.allRoomsSlice.value;
  const prev = selector.payload.countSlice.prev;
  const curr = selector.payload.countSlice.curr;
  const [drop, setDrop] = useState(false);
  const [count, setCount] = useState(0);

  // add search functionality
  const [search, setSearch] = useState("");
  const [usersSearchResults, setUsersSearchResults] = useState([]);
  const [roomsSearchResults, setRoomsSearchResults] = useState([]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // search functionality
  useEffect(() => {
    if (search.length > 0) {
      // search for users and rooms
      const userResults = Object.keys(users).filter((user) =>
        users[user].name.toLowerCase().includes(search.toLowerCase())
      );
      const roomResults = Object.keys(rooms).filter((room) =>
        rooms[room].name.toLowerCase().includes(search.toLowerCase())
      );
      setUsersSearchResults(userResults);
      setRoomsSearchResults(roomResults);
      console.log("filled", [userResults, roomResults]);
    } else {
      setUsersSearchResults([]);
      setRoomsSearchResults([]);
      console.log("empty");
    }
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDrop = () => {
    setDrop(!drop);
  };

  const dropRef = useRef(null);
  const [listening, setListening] = useState(false);
  /* eslint-disable */
  useEffect(toggleHelper(listening, setListening, dropRef, setDrop));

  const db = getDatabase();
  const notifCountRef = ref(db, "users/" + `${User?.uid}/notifCount`);

  useEffect(() => {
    if (router.pathname === "/notifications") {
      setCount(0);
    }
  }, []);

  useEffect(() => {
    if (router.isReady) {
      if (user.notifications && User) {
        dispatch(updateNotifications(users[User.uid]?.notifications));
        // filter the unseen notifications and set the count to the number of unseen notifications
        const unseen = Object.keys(user.notifications).filter(
          (key) => user.notifications[key].seen === false
        );
        setCount(unseen.length);
      }
    }
  }, [users, user, dispatch, router]);

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
              value={search}
              onChange={handleSearch}
              type="search"
              name=""
              id=""
              placeholder={`Looking for a room, ${user.name}?`}
            />
          </div>
          {usersSearchResults.length > 0 || roomsSearchResults.length > 0 ? (
            <div className={styles.searchDrop}>
              {usersSearchResults.length > 0
                ? usersSearchResults.map((user) => (
                    <div
                      className={styles.searchCon}
                      key={Math.random() + users[user].name}
                      onClick={() => {
                        router.push(`/user/${users[user].username}`);
                      }}
                    >
                      <div className={styles.searchPic}>
                        <Avatar
                          src={users[user].profile_pic}
                          alt={users[user].name}
                          sx={{
                            height: "25px",
                            width: "25px",
                          }}
                        />
                      </div>
                      <div className={styles.desCon}>
                        <div className={styles.searchName}>
                          {users[user].name}
                        </div>
                        <div className={styles.searchDesc}>User</div>
                      </div>
                    </div>
                  ))
                : null}
              {roomsSearchResults.length > 0
                ? roomsSearchResults.map((room) => (
                    <div
                      className={styles.searchCon}
                      key={Math.random() + rooms[room].name}
                      onClick={() => {
                        router.push(`/room/${room}`);
                      }}
                    >
                      <div className={styles.searchPic}>
                        <OtherHousesRoundedIcon
                          sx={{
                            color: "#8c52ff",
                            height: "25px",
                            width: "25px",
                          }}
                        />
                      </div>
                      <div className={styles.desCon}>
                        <div className={styles.searchName}>
                          {rooms[room].name}
                        </div>
                        <div className={styles.searchDesc}>Room</div>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          ) : null}
          <div className={styles.profile}>
            <Link href="/popular">
              <Tooltip title="Popular" arrow>
                <WhatshotOutlinedIcon
                  fontSize="small"
                  sx={{
                    color: "#707070",
                    position: "relative",
                    top: "0.7rem",
                    left: "0.2rem",
                  }}
                />
              </Tooltip>
            </Link>

            <Link href="/notifications">
              <Tooltip title="Notifications" arrow>
                <Badge
                  badgeContent={count}
                  color="error"
                  sx={{
                    height: "fit-content",
                    color: "#707070",
                    position: "relative",
                    top: "0.7rem",
                  }}
                >
                  <NotificationsNoneOutlinedIcon fontSize="small" />
                </Badge>
              </Tooltip>
            </Link>

            <Link href="/friends">
              <Tooltip title="Friends" arrow>
                <GroupsOutlinedIcon
                  sx={{ color: "#707070", position: "relative", top: "0.7rem" }}
                />
              </Tooltip>
            </Link>

            <Link href="/favorites">
              <Tooltip title="Favorites" arrow>
                <OtherHousesOutlinedIcon
                  fontSize="small"
                  sx={{ color: "#707070", position: "relative", top: "0.7rem" }}
                />
              </Tooltip>
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
