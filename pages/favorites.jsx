import React from "react";
import { signOut, useSession } from "next-auth/react";
import Header from "../components/Header";
import Body from "../components/Body";

function favComp() {
  return (
    <>
      <div>fav</div>
    </>
  );
}

function Favorites() {
  const { data: session, status } = useSession();

  return (
    <>
      <Header />
      <Body midComp={favComp()} />
    </>
  );
}

export default Favorites;
