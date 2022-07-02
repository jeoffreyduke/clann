import React from "react";
import styles from "../../styles/Settings.module.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function Account() {
  return (
    <div className={styles.Account}>
      <header>Account Settings</header>
      <section className={styles.firstSec}>
        <div className={styles.deleteAcc}>Delete Account</div>
        <div className={styles.delete}>
          <DeleteForeverIcon
            sx={{ color: "red", position: "relative", bottom: "0.2rem" }}
          />{" "}
          Delete Account
        </div>
      </section>
    </div>
  );
}

export default Account;
