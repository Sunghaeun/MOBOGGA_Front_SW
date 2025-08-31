import React , { useEffect, useState } from "react";
import styles from "./styles/Main.module.css";

import ClubList from "../components/ClubList";
import PageHeader from "../components/Mobile/PageHeader";

function Clubs() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className={styles.main}>
        {isMobile ? (
          <PageHeader title="동아리" />
        ) : (
          <span className={styles.categoryText}>카테고리</span>
        )}
        <ClubList />
      </div>
    </>
  );
}

export default Clubs;