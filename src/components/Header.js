import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./styles/Header.module.css";

import moboggaLogo from "../assets/Logo.svg";
import header1 from "../assets/header/1.svg";
import header2 from "../assets/header/2.svg";
import header3 from "../assets/header/3.svg";
import sidebar from "../assets/header/sidebar.svg";
import profile_btn from "../assets/temp/profile_logo.svg"; // 주석 해제 필요

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("jwt");

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img
          src={moboggaLogo}
          alt="MoboggaLogo"
          className="logoImg"
          onClick={() => navigate("/main")}
        />
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

        {localStorage.getItem("jwt") ? (
          // 로그인 상태 → 프로필 버튼
          <div
            className={styles.profile_btn}
            onClick={() => navigate("/mypage")}
          >
            <img src={profile_btn} alt="프로필" />
          </div>
        ) : (
          // 비로그인 상태 → 로그인 버튼
          <div className={styles.login} onClick={() => navigate("/login")}>
            <span>로그인</span>
          </div>
        )}

      </div>
      <div className={styles.sidebar}>
          <img
            src={sidebar}
            alt="사이드바"
          />
        </div>
    </header>
  );
}

export default Header;
