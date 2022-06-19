import styles from "../styles/Home.module.css";
import Signin from "./signin";
import Header from "../components/Header";
import { useSession } from "next-auth/react";
import Body from "../components/Body";
import Create from "./create";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      {status === "authenticated" && (
        <>
          <Signin />
        </>
      )}

      {status === "unauthenticated" && (
        <>
          <Header />
          <Create />
        </>
      )}
    </div>
  );
}
