import React from "react";
import Body from "../components/Body";
import Header from "../components/Header";

function ProfileComp() {
  return (
    <>
      <div>Profile</div>
    </>
  );
}

function Profile() {
  return (
    <>
      <Header />
      <Body midComp={<ProfileComp />} />
    </>
  );
}

export default Profile;
