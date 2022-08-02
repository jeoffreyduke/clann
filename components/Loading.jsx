import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { handleBgSwitch } from "../provider/darkSlice";
import Image from "next/image";
import styles from "../styles/Home.module.css";

function Loading() {
  const selector = useSelector(handleBgSwitch);
  const background = selector.payload.darkSlice.value;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 900) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.innerWidth]);

  return (
    <div
      className={styles.Loading}
      id={background === true ? styles.LoadingDark : null}
    >
      <Image
        src="/assets/clann/1.png"
        alt="Loading"
        height={isMobile ? 150 : 300}
        width={isMobile ? 150 : 300}
      />
      <footer>
        from <span>Clann</span>
      </footer>
    </div>
  );
}

export default Loading;
