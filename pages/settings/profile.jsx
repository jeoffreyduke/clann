import React, { useState } from "react";
import { useRouter } from "next/router";
import { ErrorBoundary } from "react-error-boundary";
import styles from "../../styles/Settings.module.css";
import { firebaseConfig } from "../index";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  getStorage,
  uploadBytes,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { updateUser, changeDP, changeCover } from "../api/database";
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
  const router = useRouter();
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

  const [progress, setProgress] = useState({
    profilePic: 0,
    coverPhoto: 0,
  });

  const [clicked, setClicked] = useState({
    profilePic: false,
    coverPhoto: false,
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

    uploadBytesResumable(fileRef, file).then((snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress({
        ...progress,
        profilePic: progress,
      });
      getDownloadURL(snapshot.ref).then((url) => {
        console.log(url);
        changeDP(user.uid, url);
        dispatch(updateDP(url));
        router.reload(); // reload the page to update the profile pic
      });
    });
  }

  function updateCoverPhoto(file, user) {
    const fileRef = ref(store, `coverPhotos/${user.uid}`);

    uploadBytesResumable(fileRef, file).then((snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress({
        ...progress,
        coverPhoto: progress,
      });
      getDownloadURL(snapshot.ref).then((url) => {
        console.log(url);
        changeCover(user.uid, url);
        dispatch(updateCover(url));
        router.reload(); // reload the page to update the cover photo
      });
    });
  }

  const handleSave = (e) => {
    e.preventDefault();

    updateUser(
      user.uid,
      userData.firstName.length > 0 && userData.surName.length > 0
        ? userData.firstName + " " + userData.surName
        : "",
      userData.bio
    );

    if (userData.firstName.length > 0 && userData.surName.length > 0) {
      dispatch(updateName(userData.firstName + " " + userData.surName));
      router.reload();
    }

    if (userData.bio.length > 0) {
      dispatch(updateBio(userData.bio));
      router.reload();
    }

    if (image.profilePic) {
      updateProfilePic(image.profilePic, user);
      setClicked({
        ...clicked,
        profilePic: true,
      });
    }

    if (image.coverPhoto) {
      updateCoverPhoto(image.coverPhoto, user);
      setClicked({
        ...clicked,
        coverPhoto: true,
      });
    }
  };

  return (
    <div className={styles.Profile}>
      <header>Customize Profile</header>
      <section className={styles.firstSec}>
        <div className={styles.proInfo}>Profile Information</div>

        <form action="get" onSubmit={(e) => e.preventDefault()}>
          <div className={styles.name}>
            Name <p>Change your name. You can only do this once a month.</p>
            <input
              onChange={handleUserData}
              name="firstName"
              type="text"
              placeholder="First Name"
              value={userData.firstName}
            />
            <input
              onChange={handleUserData}
              name="surName"
              type="text"
              placeholder="Surname"
              value={userData.surName}
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
              rows={5}
            />
          </div>

          <div className={styles.image}>
            Profile picture and cover image
            <p>Profile picture must be .png or .jpg format</p>
            <input
              onChange={handleUserImages}
              name="profilePic"
              className={styles.pp}
              type="file"
              accept="image/png, image/jpeg"
            />
            {clicked.profilePic ? (
              <div className={styles.progress}>
                Uploaded {progress.profilePic}%
              </div>
            ) : (
              ""
            )}
            <p>Cover photo must be .png or .jpg format</p>
            <input
              onChange={handleUserImages}
              name="coverPhoto"
              type="file"
              accept="image/png, image/jpeg"
            />
            {clicked.coverPhoto ? (
              <div className={styles.progress}>
                Uploaded {progress.coverPhoto}%
              </div>
            ) : (
              ""
            )}
          </div>
        </form>

        <div className={styles.btn}>
          <button onClick={handleSave}>Save changes</button>
        </div>
      </section>
    </div>
  );
}

export default Profile;
