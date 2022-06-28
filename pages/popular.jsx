import React from "react";
import Header from "../components/Header";
import Body from "../components/Body";

function PopularComp() {
  return (
    <>
      <div>popular</div>
    </>
  );
}

function Popular() {
  return (
    <>
      <Header />
      <Body midComp={<PopularComp />} />
    </>
  );
}

export default Popular;
