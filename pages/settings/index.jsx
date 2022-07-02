import React, { useState } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import styles from "../../styles/Settings.module.css";
import Account from "./account";
import Profile from "./profile";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

function Settings() {
  const router = useRouter();

  const [active, setActive] = useState({
    account: true,
    profile: false,
  });

  const handleAcc = () => {
    setActive({ account: true, profile: false });
  };

  const handlePro = () => {
    setActive({ account: false, profile: true });
  };

  return (
    <>
      <Header />
      <div className={styles.Settings}>
        <ArrowBackIosIcon
          onClick={() => router.back()}
          sx={{ color: "#8c52ff", position: "relative", left: "0.2rem" }}
        />
        <nav>
          <div
            className={active.account ? styles.active : styles.account}
            onClick={handleAcc}
          >
            Account
          </div>
          <div
            className={active.profile ? styles.active : styles.profile}
            onClick={handlePro}
          >
            Profile
          </div>
        </nav>
        {active.account ? <Account /> : <Profile />}
      </div>
    </>
  );
}

export default Settings;
