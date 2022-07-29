import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { handleAllUsers } from "../provider/allUsersSlice";
import Link from "next/link";
import Image from "next/image";
import { firebaseConfig } from ".";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  AuthErrorCodes,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { createUser } from "./api/database";
import date from "date-and-time";
import styles from "../styles/Signup.module.css";

function Signup() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const selector = useSelector(handleAllUsers);
  const [user] = useAuthState(auth);
  const router = useRouter();

  const now = new Date();
  const pattern = date.compile("MMM, DD YYYY");

  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    firstName: "",
    surName: "",
    username: "",
    mobOrEmail: "",
    password: "",
    date: "",
  });

  const createAccount = async (e) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.mobOrEmail,
        userData.password
      );

      createUser(
        userCredential.user.uid,
        userData.firstName + " " + userData.surName,
        userData.username,
        userData.mobOrEmail,
        userData.password,
        userData.date,
        "",
        "",
        "",
        "",
        date.format(now, pattern),
        ""
      );

      router.push("/");
      console.log(userCredential.user);
    } catch (error) {
      // check for error codes
      if (error.code === AuthErrorCodes.EMAIL_ALREADY_IN_USE) {
        setError("Email already in use");
        console.log(error);
      }
      if (error.code === AuthErrorCodes.INVALID_EMAIL) {
        setError("Invalid email");
        console.log(error);
      }
      if (error.code === AuthErrorCodes.WEAK_PASSWORD) {
        setError("Weak password");
        console.log(error);
      } else {
        setError("Something went wrong");
      }
    }
  };

  const handleUserData = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    // check if all fields are filled in
    if (
      userData.firstName === "" ||
      userData.surName === "" ||
      userData.username === "" ||
      userData.mobOrEmail === ""
    ) {
      setError("Please fill in all fields");
      console.log(error);
      return;
    }

    setError("");

    createAccount().then(() => {
      if (user) router.push("/signin");
    });
  };

  return (
    <div className={styles.Signup}>
      <div className={styles.logo}>
        <Image
          src="/../public/assets/clann/3.png"
          alt="logo"
          height={400}
          width={400}
        />
      </div>
      <div className={styles.loginForm}>
        <form action="get" onSubmit={(e) => e.preventDefault()}>
          <div className={styles.userName}>
            <input
              onChange={handleUserData}
              value={userData.firstName}
              name="firstName"
              required
              id="firstName"
              type="text"
              placeholder="First Name"
            />
            <input
              onChange={handleUserData}
              value={userData.surName}
              name="surName"
              required
              id="surName"
              type="text"
              placeholder="Surname"
            />
          </div>

          <div className={styles.alias}>
            <input
              onChange={handleUserData}
              value={userData.username}
              name="username"
              required
              id="username"
              type="text"
              placeholder="Clann Alias - username"
            />
          </div>

          <div className={styles.email}>
            <input
              onChange={handleUserData}
              value={userData.mobOrEmail}
              name="mobOrEmail"
              required
              id="mobOrEmail"
              type="text"
              placeholder="Mobile number or email address"
            />
          </div>

          <div className={styles.pwd}>
            <input
              onChange={handleUserData}
              value={userData.password}
              name="password"
              required
              type="password"
              id="pwd"
              placeholder="New Password"
            />
          </div>

          <div className={styles.date}>
            <input
              onChange={handleUserData}
              value={userData.data}
              name="date"
              type="date"
            />
          </div>

          <div className={styles.checkCon}>
            <div className={styles.checkBox}>
              <input type="checkbox" name="male" />
              <label htmlFor="male">Male</label>
            </div>
            <div className={styles.checkBox}>
              <input type="checkbox" name="female" />
              <label htmlFor="female">Female</label>
            </div>
            <div className={styles.checkBox}>
              <input type="checkbox" name="custom" />
              <label htmlFor="custom">Custom</label>
            </div>
          </div>

          <div className={styles.signup}>
            <input
              onClick={handleSignup}
              required
              type="button"
              value="SIGN UP"
            />
          </div>
          <p className={styles.err}>{error}</p>
          <div className={styles.signin}>
            Already have an account?
            <span>
              <Link href="/">
                <a className={styles.linkLittle}>LOG IN</a>
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
