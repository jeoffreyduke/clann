import React from "react";
import Header from "../../components/Header";
import Body from "../../components/Body";
import styles from "../../styles/Profile.module.css";
import { useDispatch, useSelector } from "react-redux";
import { handleUser, refreshUser } from "../../provider/userSlice";
import { Avatar } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Link from "next/link";

function ProfileComp() {
  const selector = useSelector(handleUser);
  const rooms = selector.payload.allRoomsSlice.value;
  const user = selector.payload.userSlice.value;

  return (
    <div className={styles.Profile}>
      <div
        className={styles.header}
        style={
          user.cover_photo
            ? {
                backgroundImage: `url(${user.cover_photo})`,
                backgroundSize: "cover",
              }
            : {}
        }
      ></div>

      <div className={styles.profilePic}>
        <Avatar
          alt="profile Picture"
          src={user.profile_pic}
          sx={{
            height: "110px",
            width: "110px",
          }}
        />
      </div>

      <div className={styles.profileName}>{user.name}</div>
      <div className={styles.profileUserName}>@{user.username}</div>
      <div className={styles.edCon}>
        <div className={styles.editProfile}>
          <Link href="/settings">
            <button>Edit profile</button>
          </Link>
        </div>
      </div>

      <div className={styles.profileBio}>{user.bio ? user.bio : "No bio"}</div>
      {/*
      <div className={styles.profileBio}>{user.location}</div> 
      <div className={styles.profileBio}>{user.joined}</div>*/}
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
