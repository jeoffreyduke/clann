import React from "react";
import Header from "../components/Header";
import Body from "../components/Body";

function FriendsComp() {
  return (
    <>
      <div>friends</div>
    </>
  );
}

function Friends() {
  return (
    <>
      <Header />
      <Body midComp={<FriendsComp />} />
    </>
  );
}

export default Friends;
