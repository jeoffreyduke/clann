import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Body from "../../components/Body";
import styles from "../../styles/Profile.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { handleUser, refreshUser } from "../../provider/userSlice";
import { Avatar } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Link from "next/link";

function ProfileComp() {
  const router = useRouter();
  const selector = useSelector(handleUser);
  const rooms = selector.payload.allRoomsSlice.value;
  const users = selector.payload.allUsersSlice.value;
  const { username } = router.query;
  const User = selector.payload.userSlice.value;

  const [user, setUser] = useState(user);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      Object.keys(users).forEach((key) => {
        if (users[key].username === username) {
          setUser(users[key]);
          setReady(true);
        }
      });
    }
    /* eslint-disable-next-line */
  }, [router.isReady, username]);

  return (
    <div className={styles.Profile}>
      {ready ? (
        <>
          <div
            className={styles.header}
            style={
              user?.cover_photo
                ? {
                    backgroundImage: `url(${user?.cover_photo})`,
                    backgroundSize: "cover",
                  }
                : {}
            }
          >
            {user?.cover_photo && User.name !== user.name ? (
              ""
            ) : (
              <Link href="/settings">
                <EditOutlinedIcon
                  sx={{ color: "#fff", height: "22px", width: "22px" }}
                />
              </Link>
            )}
          </div>

          <div className={styles.profilePic}>
            <Avatar
              alt="profile Picture"
              src={user?.profile_pic}
              sx={{
                height: "110px",
                width: "110px",
              }}
            />
          </div>

          <div className={styles.profileName}>{user?.name}</div>
          <div className={styles.profileUserName}>@{user?.username}</div>
          <div className={styles.edCon}>
            <div className={styles.editProfile}>
              {User.name === user.name ? (
                <Link href="/settings">
                  <button>Edit profile</button>
                </Link>
              ) : (
                <button>Invite user</button>
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
