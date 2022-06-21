import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Signup.module.css";

function Signup() {
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
            <input required id="user" type="text" placeholder="First Name" />
            <input required id="user" type="text" placeholder="Surname" />
          </div>

          <div className={styles.alias}>
            <input
              required
              id="user"
              type="text"
              placeholder="Clann Alias - username"
            />
          </div>

          <div className={styles.email}>
            <input
              required
              id="user"
              type="text"
              placeholder="Mobile number or email address"
            />
          </div>

          <div className={styles.pwd}>
            <input
              required
              type="password"
              name="pwd"
              id="pwd"
              placeholder=" New Password"
            />
          </div>

          <div className={styles.date}>
            <input required type="date" />
          </div>

          <div className={styles.checkCon}>
            <div className={styles.checkBox}>
              <input required type="checkbox" name="male" />
              <label htmlFor="male">Male</label>
            </div>
            <div className={styles.checkBox}>
              <input required type="checkbox" name="female" />
              <label htmlFor="female">Female</label>
            </div>
            <div className={styles.checkBox}>
              <input required type="checkbox" name="custom" />
              <label htmlFor="custom">Custom</label>
            </div>
          </div>

          <div className={styles.signup}>
            <input required type="button" value="SIGN UP" />
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
