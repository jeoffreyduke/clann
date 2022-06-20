import styles from "../styles/Home.module.css";
import Signin from "./signin";
import Header from "../components/Header";
import { useSession } from "next-auth/react";
import Body from "../components/Body";
import Home from "./home";

export default function Index() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      {status === "unauthenticated" && (
        <>
          <Signin />
        </>
      )}

      {status === "authenticated" && (
        <>
          <Header
            profilePic={session.user.image}
            userName={session.user.name}
          />
          <Home />
        </>
      )}
    </div>
  );
}
