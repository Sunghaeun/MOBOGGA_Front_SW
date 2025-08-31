/* eslint-disable */
import React from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import styles from "./styles/Header.module.css";
import ProfileTooltip from "./ProfileTooltip";

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
  const [showProfileTooltip, setShowProfileTooltip] = useState(false);

  const toggleSide = () => {
    setIsOpen(true);
  };

  // 전역 플래그로 비활성화 여부를 읽어오는 헬퍼
  const isDisabled = () => {
    try {
      return !!window.__MBOGGA_UNSAVED;
    } catch (err) {
      return false;
    }
  };
  const disabledClass = isDisabled() ? ` ${styles.disabled}` : "";

  // 안전한 네비게이션: AddInfo 등에서 전역 플래그를 통해 작성 중인지 확인
  const safeNavigate = (to) => {
    if (isDisabled()) return;
    navigate(to);
  };

  // 디버깅을 위한 로그 추가
  const isManagerUser = isManager();

  // 프로필 버튼 클릭 핸들러
  const handleProfileClick = () => {
    if (!auth) return;
    if (isManagerUser) safeNavigate("/manager/mypage");
    else safeNavigate("/mypage");
  };

  // 프로필 툴팁 핸들러
  const handleProfileMouseEnter = () => {
    setShowProfileTooltip(true);
  };

  const handleProfileMouseLeave = () => {
    setShowProfileTooltip(false);
  };

  const handleTooltipClose = () => {
    setShowProfileTooltip(false);
    handleProfileClick();
  };
  // /add-info 페이지 여부 확인
  const isAddInfoPage = location.pathname === "/add-info";

  return (
    <header className={styles.header}>
      <div className={styles.left_section}>
        <div className={styles.logo}>
          <img
            src={moboggaLogo}
            alt="MoboggaLogo"
            className={"logoImg" + disabledClass}
            onClick={() => safeNavigate("/main")}
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
            (location.pathname === "/main" ||
            location.pathname.startsWith("/show")
              ? `${styles.watching} ${styles.selectPadding}`
              : styles.back) + disabledClass
          }
          onClick={() => safeNavigate("/main")}
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
            (location.pathname.startsWith("/recruiting")
              ? `${styles.recruiting} ${styles.selectPadding}`
              : styles.back) + disabledClass
          }
          onClick={() => safeNavigate("/recruiting")}
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
            (location.pathname.startsWith("/clubs")
              ? `${styles.club} ${styles.selectPadding}`
              : styles.back) + disabledClass
          }
          onClick={() => safeNavigate("/clubs")}
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
          <div
            className={styles.manager_btn + disabledClass}
            onClick={handleProfileClick}
            onMouseEnter={handleProfileMouseEnter}
            onMouseLeave={handleProfileMouseLeave}
            style={{ position: "relative" }}
          >
            <img src={profile_btn} alt="마이페이지" />
            {/* <ProfileTooltip
              auth={auth}
              isVisible={showProfileTooltip}
              onClose={handleTooltipClose}
            /> */}
          </div>
        ) : location.pathname !== "/login" ? (
          <div className={styles.login} onClick={() => safeNavigate("/login")}>
            <span>로그인</span>
          </div>
        ) : null}
      </div>
      {/* /add-info 페이지가 아닐 때만 sidebar 아이콘과 Sidebar 컴포넌트 렌더링 */}
      {!isAddInfoPage && (
        <>
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
        </>
      )}
    </header>
  );
}

export default Header;
