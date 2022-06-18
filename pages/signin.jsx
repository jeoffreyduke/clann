import React, { useEffect } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import styles from "../styles/Signin.module.css";

function Signin() {
  return (
    <div className={styles.Signin}>
      <div className={styles.con}>
        <section className={styles.left}>
          <Image
            src="/../public/assets/lefttt.jpg"
            alt="logo"
            layout="fill"
            objectFit="cover"
          />
          <div className={styles.image}>
            <Image
              src="/../public/assets/leftdark.png"
              alt="logo"
              height={500}
              width={500}
            />
          </div>
        </section>
        <section className={styles.right}>
          <div className={styles.imageRight}>
            <Image
              src="/../public/assets/leftlight.png"
              alt="logo"
              height={100}
              width={100}
            />
          </div>
          <div className={styles.bigTxt}>Wanna connect?</div>
          <div className={styles.smTxt}>
            Rete will make sure you are connected to the right services.
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
            <div className={styles.user}>
              <div>
                <label htmlFor="user">Email address or username</label>
              </div>
              <input
                id="user"
                type="text"
                placeholder="Email address or username"
              />
            </div>
            <div className={styles.pwd}>
              <div>
                <label htmlFor="pwd">Password</label>
              </div>
              <input
                type="password"
                name="pwd"
                id="pwd"
                placeholder="Password"
              />
            </div>
            <div className={styles.forgot}>Forgot your password?</div>
            <div className={styles.login}>
              <button>LOG IN</button>
            </div>
            <hr className={styles.lastline} />
            <div className={styles.signup}>
              New to Rete? <span>SIGN UP</span>
            </div>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>© 2022 Rete, Ltd.</footer>
    </div>
  );
}

export default Signin;
