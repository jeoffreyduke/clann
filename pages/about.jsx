import React from "react";
import Header from "../components/Header";
import Body from "../components/Body";
import Head from "next/head";

function AboutComp() {
    return (
      <>
        <div>About us</div>
      </>
    );
  }
  
  function About() {
    return (
      <>
        <Head>
          <title>About / Clann</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <Body midComp={<AboutComp />} />
      </>
    );
  }
  
  export default About;