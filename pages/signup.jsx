import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { firebaseConfig } from ".";
import { initializeApp } from "firebase/app";
import { createUser } from "./api/database";
import styles from "../styles/Signup.module.css";

function Signup() {
  const app = initializeApp(firebaseConfig);

  const [userId, setUserId] = useState(0);

  const [userData, setUserData] = useState({
    firstName: "",
    surName: "",
    username: "",
    mobOrEmail: "",
    password: "",
    date: "",
  });

  const handleUserData = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
    console.log(userData);
  };

  const handleSignup = (e) => {
    e.preventDefault();

    createUser(
      userId,
      userData.firstName,
      userData.surName,
      userData.mobOrEmail,
      userData.password,
      userData.date
    );

    setUserId((prevUserId) => prevUserId + 1);
    console.log(userData.firstName + "has been created");
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
              id="user"
              type="text"
              placeholder="First Name"
            />
            <input
              onChange={handleUserData}
              value={userData.surName}
              name="surName"
              required
              id="user"
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
              id="user"
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
              id="user"
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
              placeholder=" New Password"
            />
          </div>

          <div className={styles.date}>
            <input
              onChange={handleUserData}
              value={userData.data}
              name="data"
              required
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
          <div className={styles.signin}>
            Already have an account?
            <span>
              <Link href="/signin">
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
