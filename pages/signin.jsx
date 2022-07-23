import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleUser } from "../provider/userSlice";
import { handleAllUsers } from "../provider/allUsersSlice";
import { firebaseConfig } from ".";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import { clearAllUsers } from "./api/database";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import styles from "../styles/Signin.module.css";

function Signin() {
  const dispatch = useDispatch();
  const selector = useSelector(handleUser);
  const user = selector.payload.userSlice.value;
  const users = selector.payload.allUsersSlice.value;

  const [userdata, setUserdata] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

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
      console.log(userCredential.user);
    } catch (error) {
      error === "FirebaseError: Firebase: Error (auth/wrong-password)."
        ? setError("Wrong password, please try again")
        : setError("Your email does not seem to be correct");
      console.log(error);
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
      // if email is wrong set the error message
      if (users[key].email !== userdata.email) {
        setError("Your email does not seem to be correct");
        console.log(error);
      }

      // if email is correct and password is wrong set the error message
      if (
        users[key].email === userdata.email &&
        users[key].password !== userdata.password
      ) {
        setError("Wrong password, please try again");
        console.log("wrong password");
      }

      if (
        users[key].email === userdata.email &&
        users[key].password === userdata.password
      ) {
        setError("");
        dispatch(handleUser(users[key]));
        loginEmailPassword();
        console.log(users[key]);
      }
    }
  };

  useEffect(() => {}, []);

  return (
    <div className={styles.Signin}>
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
              height={200}
              width={200}
            />
          </div>
          <div className={styles.rightContent}>
            <div className={styles.bigTxt}>{"You're not alone."}</div>
            <div className={styles.smTxt}>
              At Clann we make sure you feel heard and understood.
            </div>
            <div className={styles.btnCon}>
              <div onClick={() => signIn()} className={styles.google}>
                <span /> CONTINUE WITH GOOGLE
              </div>
              <div onClick={() => signIn()} className={styles.facebook}>
                <span>
                  <svg
                    role="img"
                    focusable="false"
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      data-name="White"
                      d="M20 3H4a1 1 0 00-1 1v16a1 1 0 001 1h8.62v-7h-2.35v-2.69h2.35v-2a3.27 3.27 0 013.49-3.59 19.25 19.25 0 012.1.11v2.43h-1.44c-1.13 0-1.35.54-1.35 1.32v1.73h2.69L17.76 14h-2.34v7H20a1 1 0 001-1V4a1 1 0 00-1-1z"
                      fill="#1877f2"
                    ></path>
                  </svg>
                </span>
                CONTINUE WITH FACEBOOK
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
                <div className={styles.user}>
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
                <div className={styles.pwd}>
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
                <hr className={styles.lastline} />
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
