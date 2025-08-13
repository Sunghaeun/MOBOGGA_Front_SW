import React from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

  const [isOpen, setIsOpen] = useState(false);
  const toggleSide = () => {
    setIsOpen(true);
  };

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
          <div
            className={styles.manager_btn}
            onClick={() => navigate("/mypage")}
          >
            <img src={profile_btn} alt="마이페이지" />
          </div>
        ) : (
          <div className={styles.login} onClick={() => navigate("/login")}>
            <span>로그인</span>
          </div>
        )}
      </div>
      <div className={styles.sidebar} onClick={toggleSide}>
        <img src={sidebar} alt="사이드바" />
      </div>

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  );
}

export default Header;
