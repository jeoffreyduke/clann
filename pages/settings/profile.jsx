import React, { useState } from "react";
import styles from "../../styles/Settings.module.css";
import { firebaseConfig } from "../index";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { updateUser, changeBio, changeDP, changeCover } from "../api/database";
import { useDispatch, useSelector } from "react-redux";
import {
  handleUser,
  updateBio,
  updateName,
  updateDP,
  updateCover,
} from "../../provider/userSlice";

function Profile() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const store = getStorage(app);
  const [user] = useAuthState(auth);
  const dispatch = useDispatch();
  const selector = useSelector(handleUser);
  //const user = selector.payload.userSlice.value;

  const [userData, setUserData] = useState({
    firstName: "",
    surName: "",
    bio: "",
  });

  const [image, setImage] = useState({
    profilePic: "",
    coverPhoto: "",
  });

  const handleUserData = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
    console.log(userData);
  };

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
      updateProfilePic(image.profilePic, user);
      dispatch(updateDP(image.profilePic));
    }

    if (image.coverPhoto) {
      updateCoverPhoto(image.coverPhoto, user);
      dispatch(updateCover(image.coverPhoto));
    }

    updateUser(
      user.uid,
      userData.firstName.length > 0 && userData.surName.length > 0
        ? userData.firstName + " " + userData.surName
        : "",
      userData.bio
    );

    if (userData.firstName.length > 0 && userData.surName.length > 0) {
      dispatch(updateName(userData.firstName + " " + userData.surName));
    }

    if (userData.bio.length > 0) {
      dispatch(updateBio(userData.bio));
    }

    window.location.reload();
  };

  return (
    <>
      <header>Customize Profile</header>
      <section className={styles.firstSec}>
        <div className={styles.proInfo}>Profile Information</div>

        <form action="get" onSubmit={(e) => e.preventDefault()}>
          <div className={styles.name}>
            Name <p>Change your name. You can only do this once a month.</p>
            <input
              onChange={handleUserData}
              value={userData.firstName}
              name="firstName"
              type="text"
              placeholder="First Name"
            />
            <input
              onChange={handleUserData}
              value={userData.surName}
              name="surName"
              type="text"
              placeholder="Surname"
            />
          </div>

          <div className={styles.bio}>
            Bio (optional)
            <p>Add something about yourself, as long as you want.</p>
            <textarea
              onChange={handleUserData}
              value={userData.bio}
              name="bio"
              placeholder="Bio (optional)"
              rows="5"
            />
          </div>

          <div className={styles.image}>
            Profile picture and cover image
            <p>Profile picture must be .png or .jpg format</p>
            <input
              onChange={handleUserImages}
              value={image.profilePic}
              name="profilePic"
              className={styles.pp}
              type="file"
              accept="image/png, image/jpeg"
            />
            <p>Cover photo must be .png or .jpg format</p>
            <input
              onChange={handleUserImages}
              value={image.coverPhoto}
              name="coverPhoto"
              type="file"
              accept="image/png, image/jpeg"
            />
          </div>
        </form>

        <div className={styles.btn}>
          <button onClick={handleSave}>Save changes</button>
        </div>
      </section>
    </>
  );
}

export default Profile;
