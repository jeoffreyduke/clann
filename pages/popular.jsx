import React from "react";
import Header from "../components/Header";
import Body from "../components/Body";
import Head from "next/head";

function PopularComp() {
  return (
    <>
      <div>Coming soon</div>
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
