import React from "react";
import styles from "../styles/About.module.css"
import Header from "../components/Header";
import Body from "../components/Body";
import Head from "next/head";

function AboutComp() {
    return (
      <>
        <h2 className={styles.heading} >About Us</h2>
        <p className={styles.content}>Vibe was created with the mission to provide people with a
           convenient and affordable way to connect with others who share similar interests. We believe that everyone should have access to support groups and the comfort that comes with them, regardless of location or circumstance.<br/><br/>

          Vibe is a virtual platform that uses voice chats to connect people of common interest.
          Our project was initiated by <b>Hahz & Candy,</b> who wanted to help people unite world wide. 
          Vibe offers a convenient and affordable way for people to connect with others who share similar interests, providing them with the support they need.</p>
      </>
    );
  }
  
  function About() {
    return (
      <>
        <Head>
          <title>About / Vibe</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <Body midComp={<AboutComp />} />
      </>
    );
  }
  
  export default About;