import React from "react";
import Header from "../components/Header";
import Body from "../components/Body";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Friends.module.css";

function PopularComp() {
  return (
    <>
      <div className={styles.underCons}>
        <div className={styles.con}>
          <div className={styles.underConsImg}>
            <Image
              src="/assets/construction.svg"
              alt="Under construction"
              width={300}
              height={300}
            />
          </div>
          <div className={styles.underConsText}>
            This page is under construction.
          </div>
        </div>
      </div>
    </>
  );
}

function Popular() {
  return (
    <>
      <Head>
        <title>Popular / Clann</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Body midComp={<PopularComp />} />
    </>
  );
}

export default Popular;
