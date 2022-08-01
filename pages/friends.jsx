import React from "react";
import Header from "../components/Header";
import Body from "../components/Body";
import Head from "next/head";

function FriendsComp() {
  return (
    <>
      <div>Coming soon</div>
    </>
  );
}

function Friends() {
  return (
    <>
      <Head>
        <title>Friends / Clann</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Body midComp={<FriendsComp />} />
    </>
  );
}

export default Friends;
