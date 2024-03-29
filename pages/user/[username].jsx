import React, { useEffect, useState, useRef } from "react";
import Header from "../../components/Header";
import Body from "../../components/Body";
import styles from "../../styles/Profile.module.css";
import toggleHelper from "../../customHooks/toggleHelper";
import { trimName } from "../../customHooks/trimName";
import { updateUserNotifications } from "../../provider/allUsersSlice";
import { getDatabase, onValue, ref } from "firebase/database";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { handleUser, refreshUser } from "../../provider/userSlice";
import { createNotification } from "../api/database";
import { Avatar, keyframes } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import Backdrop from "@mui/material/Backdrop";
import Tooltip from "@mui/material/Tooltip";
import Link from "next/link";
import Head from "next/head";

function BackdropComp({ profilePic, coverPhoto, isMobile }) {
  return (
    <>
      <Backdrop
        open={true}
        sx={{
          color: "#8c52ff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <div className={styles.close}>
          <Tooltip title="Close" arrow>
            <CloseIcon />
          </Tooltip>
        </div>
        <div className={styles.backdropCon}>
          {profilePic ? (
            <Avatar
              alt="profile Picture"
              src={profilePic}
              sx={{
                height: "inherit",
                width: "inherit",
              }}
            />
          ) : (
            ""
          )}

          {coverPhoto ? (
            <div
              style={
                coverPhoto
                  ? {
                      height: isMobile ? "7.5rem" : "20rem",
                      width: isMobile ? "100%" : "50rem",
                      position: "relative",
                      top: isMobile ? "5.5rem" : "2.5rem",
                      right: isMobile ? "0" : "12rem",
                      backgroundImage: `url(${coverPhoto})`,
                      backgroundSize: isMobile ? "contain" : "cover",
                    }
                  : {}
              }
            ></div>
          ) : (
            ""
          )}
        </div>
      </Backdrop>
    </>
  );
}

function ProfileComp() {
  const router = useRouter();
  const dispatch = useDispatch();
  const selector = useSelector(handleUser);
  const rooms = selector.payload.allRoomsSlice.value;
  const users = selector.payload.allUsersSlice.value;
  const { username } = router.query;
  const User = selector.payload.userSlice.value;
  const background = selector.payload.darkSlice.value;

  const [isMobile, setIsMobile] = useState(false);
  const [id, setId] = useState(null);
  const [user, setUser] = useState(user);
  const [ready, setReady] = useState(false);
  const [drop, setDrop] = useState(false);
  const [backdrop, setBackdrop] = useState({
    profilePic: false,
    coverPhoto: false,
  });

  const [invited, setInvited] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      Object.keys(users).forEach((key) => {
        if (users[key].username === username) {
          setUser(users[key]);
          setId(key);
          setReady(true);
        }
      });
    }
    /* eslint-disable-next-line */
  }, [router.isReady, username]);

  const dropRef = useRef(null);
  const [listening, setListening] = useState(false);
  /* eslint-disable */
  useEffect(toggleHelper(listening, setListening, dropRef, setDrop));

  const handleInviteUser = (roomId) => {
    if (ready) {
      createNotification(
        id,
        ` has invited you to their room.`,
        User,
        false,
        roomId
      );

      const db = getDatabase();
      const notifsRef = ref(db, "users/" + `${id}/notifications`);

      onValue(notifsRef, (snapshot) => {
        dispatch(
          updateUserNotifications({
            userId: id,
            notifications: snapshot.val(),
          })
        );
      });

      setDrop(!drop);
      setInvited(true);
    }
  };

  useEffect(() => {
    if (window.innerWidth <= 900) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

  return (
    <div className={styles.Profile}>
      <Head>
        <title>{user?.name} / Clann</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {ready ? (
        <>
          <div
            className={styles.header}
            onClick={
              user?.cover_photo && User.name !== user.name
                ? () => setBackdrop({ ...backdrop, coverPhoto: true })
                : null
            }
            style={
              user?.cover_photo
                ? {
                    backgroundImage: `url(${user?.cover_photo})`,
                    backgroundSize: "cover",
                    cursor: "pointer",
                  }
                : {}
            }
          >
            {User.name !== user.name ? (
              ""
            ) : (
              <Link href="/settings">
                <Tooltip title="Edit Cover Photo" arrow>
                  <EditIcon
                    sx={{
                      color: "#fff",
                      height: isMobile ? "18px" : "22px",
                      width: isMobile ? "18px" : "22px",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              </Link>
            )}
          </div>

          {backdrop.coverPhoto ? (
            <div
              className={styles.backdrop}
              onClick={() => setBackdrop({ ...backdrop, coverPhoto: false })}
            >
              <BackdropComp
                coverPhoto={user?.cover_photo}
                isMobile={isMobile}
              />
            </div>
          ) : (
            ""
          )}

          <div
            className={styles.profilePic}
            id={background === true ? styles.profilePicDark : null}
            onClick={
              user?.profile_pic && User.name !== user.name
                ? () => setBackdrop({ ...backdrop, profilePic: true })
                : null
            }
          >
            <Avatar
              alt="profile Picture"
              src={user?.profile_pic}
              sx={{
                height: isMobile ? "55px" : "110px",
                width: isMobile ? "55px" : "110px",
                cursor: "pointer",
              }}
            />
          </div>

          {backdrop.profilePic ? (
            <div
              className={styles.backdrop}
              onClick={() => setBackdrop({ ...backdrop, profilePic: false })}
            >
              <BackdropComp
                profilePic={user?.profile_pic}
                isMobile={isMobile}
              />
            </div>
          ) : (
            ""
          )}

          <div className={styles.profileName}>{user?.name}</div>
          <div className={styles.profileUserName}>@{user?.username}</div>
          <div className={styles.edCon}>
            <div className={styles.editProfile} ref={dropRef}>
              {User.name === user.name ? (
                <Link href="/settings">
                  <button>Edit profile</button>
                </Link>
              ) : (
                <>
                  <button disabled={invited} onClick={() => setDrop(true)}>
                    {!invited ? "Invite user" : "Invited"}
                  </button>
                  {drop && (
                    <div className={styles.drop}>
                      {User?.favorites ? (
                        Object.keys(User?.favorites).map((room) => (
                          <div
                            key={Math.random()}
                            onClick={() => handleInviteUser(room)}
                            className={styles.dropItem}
                          >
                            {trimName(rooms[room].name, 10)}
                          </div>
                        ))
                      ) : (
                        <div className={styles.addRoom}>
                          Add a room to your favs.
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className={styles.profileBio}>
            {user?.bio ? user?.bio : "No bio"}
          </div>
          {/*
      <div className={styles.profileBio}>{user?.location}</div> 
      <div className={styles.profileBio}>{user?.joined}</div>*/}
        </>
      ) : (
        ""
      )}
    </div>
  );
}

function Profile() {
  return (
    <>
      <Header />
      <Body midComp={<ProfileComp />} />
    </>
  );
}

export default Profile;
