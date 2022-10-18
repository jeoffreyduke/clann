import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleUser } from "../provider/userSlice";
import { handleAllUsers } from "../provider/allUsersSlice";
import { firebaseConfig } from ".";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  AuthErrorCodes,
} from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import { clearAllUsers } from "./api/database";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Signin.module.css";
import Head from "next/head";
import { handleBgSwitch } from "../provider/darkSlice";

function Signin() {
  const dispatch = useDispatch();
  const selector = useSelector(handleUser);
  const user = selector.payload.userSlice.value;
  const users = selector.payload.allUsersSlice.value;
  const background = selector.payload.darkSlice.value;

  const [userdata, setUserdata] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase();
  const userRef = ref(db, "users/");

  const loginEmailPassword = async (e) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userdata.email,
        userdata.password
      );
    } catch (error) {
      switch (error.code) {
        case AuthErrorCodes.INVALID_EMAIL:
          setError("Invalid email");
          break;
        case AuthErrorCodes.USER_NOT_FOUND:
          setError("User not found");
          break;
        case AuthErrorCodes.WRONG_PASSWORD:
          setError("Wrong password");
          break;
        default:
          setError("Something went wrong");
      }
    }
  };

  const handleUserData = (e) => {
    setUserdata({
      ...userdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    for (const key in users) {
      if (
        users[key].email === userdata.email &&
        users[key].password === userdata.password
      ) {
        setError("");
        dispatch(handleUser(users[key]));
        dispatch(handleBgSwitch(users[key].background));
        console.log(background);
        console.log(users[key]);
        loginEmailPassword();
      } else if (
        users[key].password === userdata.password &&
        users[key].email !== userdata.email
      ) {
        setError("Your email does not seem to be correct");
        console.log(error);
      } else if (
        users[key].email === userdata.email &&
        users[key].password !== userdata.password
      ) {
        setError("Wrong password, please try again");
        console.log("wrong password");
      }
    }
  };

  useEffect(() => {
    if (window.innerWidth <= 900) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.innerWidth]);

  return (
    <div
      className={styles.Signin}
      id={background === true ? styles.SigninDark : null}
    >
      <Head>
        <title>Sign In / Clann</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.con}>
        <section className={styles.left}>
          <Image
            src="/assets/cover.jpg"
            alt="logo"
            layout="fill"
            objectFit="cover"
          />
        </section>
        <section className={styles.right}>
          <div className={styles.imageRight}>
            <Image
              src="/assets/clann/1.png"
              alt="logo"
              height={isMobile ? 130 : 200}
              width={isMobile ? 130 : 200}
            />
          </div>
          <div className={styles.rightContent}>
            <div className={styles.bigTxt}>{"You're not alone."}</div>
            <div className={styles.smTxt}>
              At Clann we make sure you feel heard and understood.
            </div>
            <div className={styles.btnCon}>
            <div
                className={styles.facebook}
                id={background === true ? styles.facebookDark : null}
              >
                GUEST LOGIN
              </div>
              <div
                className={styles.google}
                id={background === true ? styles.googleDark : null}
              >
                <span /> CONTINUE WITH GOOGLE
              </div>
            </div>

            <div className={styles.orCon}>
              <div className={styles.or}>
                <hr />
                <span>OR</span>
                <hr />
              </div>
            </div>

            <div className={styles.loginForm}>
              <form action="get" onSubmit={(e) => e.preventDefault()}>
                <div
                  className={styles.user}
                  id={background === true ? styles.userDark : null}
                >
                  <div>
                    <label htmlFor="user">Email address</label>
                  </div>
                  <input
                    onChange={handleUserData}
                    required
                    value={userdata.email}
                    name="email"
                    id="user"
                    type="text"
                    placeholder="Email address"
                  />
                </div>
                <div
                  className={styles.pwd}
                  id={background === true ? styles.pwdDark : null}
                >
                  <div>
                    <label htmlFor="pwd">Password</label>
                  </div>
                  <input
                    onChange={handleUserData}
                    required
                    value={userdata.password}
                    name="password"
                    type="password"
                    id="pwd"
                    placeholder="Password"
                  />
                </div>
                <p className={styles.err}>{error}</p>
                <div className={styles.forgot}>Forgot your password?</div>
                <div className={styles.login}>
                  <input onClick={handleLogin} type="button" value="LOG IN" />
                </div>
                <div className={styles.signup}>
                  New to Clann?
                  <span>
                    <Link href="/signup">
                      <a className={styles.linkLittle}>SIGN UP</a>
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>© 2022 Clann, Ltd.</footer>
    </div>
  );
}

export default Signin;