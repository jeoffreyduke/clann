import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { handleBgSwitch } from "../../provider/darkSlice";
import Header from "../../components/Header";
import styles from "../../styles/Settings.module.css";
import Account from "./account";
import Profile from "./profile";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Head from "next/head";

function Settings() {
  const router = useRouter();
  const selector = useSelector(handleBgSwitch);
  const background = selector.payload.darkSlice.value;

  const [active, setActive] = useState({
    account: false,
    profile: true,
  });

  const handleAcc = () => {
    setActive({ account: true, profile: false });
  };

  const handlePro = () => {
    setActive({ account: false, profile: true });
  };

  return (
    <>
      <Head>
        <title>Settings / Clann</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div
        className={styles.Settings}
        id={background === true ? styles.SettingsDark : null}
      >
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
        {active.profile ? <Profile /> : <Account />}
      </div>
    </>
  );
}

export default Settings;
