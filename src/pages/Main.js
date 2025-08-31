import React from "react";
import styles from "./styles/Main.module.css";
import { useMediaQuery } from "react-responsive";
import { useLocation } from "react-router-dom";

import Banner from "../components/Banner";
import ShowList from "../components/ShowList";
import MobileBanner from "../components/MobileBanner";

function Main() {
  const isMobile = useMediaQuery({ query: "(max-width: 1280px)" });
  const location = useLocation();

  // /main에서는 배너 표시, /show/*에서는 배너 미표시
  const showBanner = location.pathname === "/main";

  return (
    <>
      {showBanner && (isMobile ? <MobileBanner /> : <Banner />)}

      <div className={styles.main}>
        <span className={styles.categoryText}>카테고리</span>
        <ShowList />
      </div>
    </>
  );
}

export default Main;
