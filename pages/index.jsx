import styles from "../styles/Home.module.css";
import Signin from "./signin";
import Header from "../components/Header";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
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
          <Header profilePic={session.user.image} />
          <p>You have sucessfully logged in as: {session.user.name}</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      )}
    </div>
  );
}
