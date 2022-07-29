import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Header from "../../components/Header";
import Body from "../../components/Body";

const RoomComp = dynamic(() => import("../../components/RoomComp"), {
  ssr: false,
});

function room() {
  return (
    <>
      <Header />
      <Body midComp={<RoomComp />} />
    </>
  );
}

export default room;
