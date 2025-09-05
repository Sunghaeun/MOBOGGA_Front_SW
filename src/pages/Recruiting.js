import React, { useEffect, useState } from "react";
import styles from "./styles/Recruiting.module.css";

import RecruitingList from "../components/RecruitingList";
import PageHeader from "../components/Mobile/PageHeader";

function Recruiting() {
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
      <div className={styles.recruiting}>
        {isMobile ? (
          <PageHeader title="리쿠르팅" />
        ) : (
          <span className={styles.categoryText}>카테고리</span>
        )}
        <RecruitingList />
      </div>
    </>
  );
}

export default Recruiting;
