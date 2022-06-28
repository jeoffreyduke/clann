import React from "react";
import Body from "../components/Body";
import Header from "../components/Header";

function FavComp() {
  return (
    <>
      <div>Notifications</div>
    </>
  );
}

function Notifications() {
  return (
    <>
      <Header />
      <Body midComp={<FavComp />} />
    </>
  );
}

export default Notifications;
