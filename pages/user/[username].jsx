import React, { useState } from "react";
import Header from "../../components/Header";
import Body from "../../components/Body";
import styles from "../../styles/Profile.module.css";
import { useDispatch, useSelector } from "react-redux";
import pStyles from "../../styles/Settings.module.css";
import { firebaseConfig } from "../index";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { changeDP, changeCover } from "../api/database";
import { handleUser, refreshUser } from "../../provider/userSlice";
import { Avatar } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Link from "next/link";

function ProfileComp() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const store = getStorage(app);
  const [userr] = useAuthState(auth);
  const dispatch = useDispatch();
  const selector = useSelector(handleUser);
  const rooms = selector.payload.allRoomsSlice.value;
  const user = selector.payload.userSlice.value;

  const [image, setImage] = useState({
    profilePic: "",
    coverPhoto: "",
  });

  const handleUserImages = (e) => {
    if (e.target.files[0]) {
      setImage({
        ...image,
        [e.target.name]: e.target.files[0],
      });
    }
    console.log(image);
  };

  function updateProfilePic(file, user) {
    const fileRef = ref(store, `profilePics/${user.uid}`);

    uploadBytes(fileRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        changeDP(user.uid, url);
      });
    });
  }

  function updateCoverPhoto(file, user) {
    const fileRef = ref(store, `coverPhotos/${user.uid}`);

    uploadBytes(fileRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        changeCover(user.uid, url);
      });
    });
  }

  const handleSave = (e) => {
    e.preventDefault();

    if (image.profilePic) {
      updateProfilePic(image.profilePic, userr);
      dispatch(updateDP(image.profilePic));
    }

    if (image.coverPhoto) {
      updateCoverPhoto(image.coverPhoto, userr);
      dispatch(updateCover(image.coverPhoto));
    }

    window.location.reload();
  };

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
      >
        <div className={styles.editCover}>
          <div>
            <EditOutlinedIcon
              sx={{
                color: "#8c52ff",
                height: "20px",
                width: "20px",
              }}
            />
          </div>
        </div>
      </div>
      <div className={styles.coverInput}>
        <input
          onChange={handleUserImages}
          value={image.coverPhoto}
          name="coverPhoto"
          type="file"
          accept="image/png, image/jpeg"
        />
      </div>

      <div className={styles.dpInput}>
        <input
          onChange={handleUserImages}
          value={image.profilePic}
          name="profilePic"
          className={styles.pp}
          type="file"
          accept="image/png, image/jpeg"
        />
      </div>

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
