import React from "react";
import styles from "./styles/Main.module.css";
import { useMediaQuery } from "react-responsive";

import Banner from "../components/Banner";
import ShowList from "../components/ShowList";
import MobileBanner from "../components/MobileBanner";

function Main() {
  const isMobile = useMediaQuery({ query: "(max-width: 440px)" });
  return (
    <>
      {isMobile ? <MobileBanner /> : <Banner />}

      <div className={styles.main}>
        <span className={styles.categoryText}>카테고리</span>
        <ShowList/>
      </div>
    </>
  );
}

export default Main;
