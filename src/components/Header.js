import React from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import styles from "./styles/Header.module.css";

import moboggaLogo from "../assets/Logo.svg";
import header1 from "../assets/header/1.svg";
import header2 from "../assets/header/2.svg";
import header3 from "../assets/header/3.svg";
import sidebar from "../assets/header/sidebar.svg";
import profile_btn from "../assets/temp/profile_logo.svg"; // 주석 해제 필요
import Sidebar from "./Mobile/Sidebar"; // Assuming Sidebar is a component that handles the sidebar functionality

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, isLoggedIn, isLoading, isManager } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const toggleSide = () => {
    setIsOpen(true);
  };

  // 디버깅을 위한 로그 추가
  const isManagerUser = isManager();
  console.log("Header - auth:", auth);
  console.log("Header - isLoggedIn:", isLoggedIn);
  console.log("Header - isLoading:", isLoading);
  console.log("Header - isManagerUser:", isManagerUser);

  // 프로필 버튼 클릭 핸들러
  const handleProfileClick = () => {
    console.log("=== PROFILE CLICK DEBUG ===");
    console.log("auth:", auth);
    console.log("isLoggedIn:", isLoggedIn);
    console.log("isManagerUser:", isManagerUser);

    if (!auth) {
      console.log("권한 정보가 없음");
      return;
    }

    console.log("사용자 권한:", auth.authority);

    if (isManagerUser) {
      console.log("매니저로 인식 - /manager/mypage로 이동");
      navigate("/manager/mypage");
    } else {
      console.log("일반 사용자로 인식 - /mypage로 이동");
      navigate("/mypage");
    }
  };
  return (
    <header className={styles.header}>
      <div className={styles.left_section}>
        <div className={styles.logo}>
          <img
            src={moboggaLogo}
            alt="MoboggaLogo"
            className="logoImg"
            onClick={() => navigate("/main")}
          />
        </div>
        {isManagerUser && (
          <div className={styles.manager_caution}>
            <span>동아리 계정</span>
          </div>
        )}
      </div>

      <div className={styles.right}>
        <div
          className={
            location.pathname === "/main" ||
            location.pathname.startsWith("/show")
              ? `${styles.watching} ${styles.selectPadding}`
              : styles.back
          }
          onClick={() => navigate("/main")}
        >
          <img
            src={header1}
            alt=""
            className={
              location.pathname === "/main" ||
              location.pathname.startsWith("/show") ||
              location.pathname.startsWith("/entertain")
                ? styles.background
                : styles.nan
            }
          />
          <span
            className={
              location.pathname === "/main" ||
              location.pathname.startsWith("/show") ||
              location.pathname.startsWith("/entertain")
                ? styles.fronttext
                : ""
            }
          >
            볼거리
          </span>
        </div>

        <div
          className={
            location.pathname.startsWith("/recruiting")
              ? `${styles.recruiting} ${styles.selectPadding}`
              : styles.back
          }
          onClick={() => navigate("/recruiting")}
        >
          <img
            src={header2}
            alt=""
            className={
              location.pathname.startsWith("/recruiting")
                ? styles.background
                : styles.nan
            }
          />
          <span
            className={
              location.pathname.startsWith("/recruiting")
                ? styles.fronttext
                : ""
            }
          >
            리크루팅
          </span>
        </div>

        <div
          className={
            location.pathname.startsWith("/clubs")
              ? `${styles.club} ${styles.selectPadding}`
              : styles.back
          }
          onClick={() => navigate("/clubs")}
        >
          <img
            src={header3}
            alt=""
            className={
              location.pathname.startsWith("/clubs")
                ? styles.background
                : styles.nan
            }
          />
          <span
            className={
              location.pathname.startsWith("/clubs") ? styles.fronttext : ""
            }
          >
            동아리
          </span>
        </div>

        {isLoggedIn && auth ? (
          <div className={styles.manager_btn} onClick={handleProfileClick}>
            <img src={profile_btn} alt="마이페이지" />
          </div>
        ) : location.pathname !== "/login" ? (
          <div className={styles.login} onClick={() => navigate("/login")}>
            <span>로그인</span>
          </div>
        ) : null}
      </div>
      <div className={styles.sidebar} onClick={toggleSide}>
        <img src={sidebar} alt="사이드바" />
      </div>

      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        auth={auth}
        isLoggedIn={isLoggedIn}
        isLoading={isLoading}
        isManager={isManager}
      />
    </header>
  );
}

export default Header;
