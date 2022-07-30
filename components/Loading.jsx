import Image from "next/image";
import styles from "../styles/Home.module.css";
import React from "react";

function Loading() {
  return (
    <div className={styles.Loading}>
      <Image src="/assets/clann/1.png" alt="Loading" />
    </div>
  );
}

export default Loading;
