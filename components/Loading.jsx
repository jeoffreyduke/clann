import Image from "next/image";
import styles from "../styles/Home.module.css";
import React, { useEffect, useState } from "react";

function Loading() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 900) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

  return (
    <div className={styles.Loading}>
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
