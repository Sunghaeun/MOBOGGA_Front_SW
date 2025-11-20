import React from "react";
import styles from "./styles/Main.module.css";
import { useMediaQuery } from "react-responsive";
import { useLocation } from "react-router-dom";

import Banner from "../components/Banner";
import ShowList from "../components/ShowList";
import MobileBanner from "../components/MobileBanner";

function Main() {
  console.log('Main component rendered'); // 디버깅용
  
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const location = useLocation();

  console.log('Current location:', location.pathname); // 현재 경로 확인
  console.log('Is mobile:', isMobile); // 모바일 여부 확인

  // /main에서는 배너 표시, /show/*에서는 배너 미표시
  const showBanner = location.pathname === "/main"; 

  console.log('Show banner:', showBanner); // 배너 표시 여부 확인

  return (
    <>
      {showBanner && (isMobile ? <MobileBanner /> : <Banner />)}

      <div className={styles.mainPage}>
        <span className={styles.categoryText}>카테고리</span>
        <ShowList />
      </div>
    </>
  );
}

export default Main;
