import React from "react";
import { signOut, useSession } from "next-auth/react";
import Header from "../components/Header";
import Body from "../components/Body";

function discoverComp() {
  return (
    <>
      <div>discover</div>
    </>
  );
}

function Discover() {
  const { data: session, status } = useSession();

  return (
    <>
      <Header />
      <Body midComp={discoverComp()} />
    </>
  );
}

export default Discover;
