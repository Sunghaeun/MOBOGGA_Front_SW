/* eslint-disable */
import React, { useState } from "react";
import styles from "./styles/Sidebar.module.css";
import { useNavigate } from "react-router-dom";

function Sidebar({
  isOpen,
  setIsOpen,
  auth,
  isLoggedIn,
  isLoading,
  isManager,
}) {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  };

  const closeSidebar = () => setIsOpen(false);
  const go = (path) => {
    navigate(path);
    closeSidebar();
  };

  // 마이페이지 이동 핸들러
  const handleMyPageClick = () => {
    if (!auth) {
      console.log("권한 정보가 없음");
      return;
    }

    console.log("Sidebar - 사용자 권한:", auth.authority);

    if (isManager()) {
      go("/manager/mypage");
    } else {
      go("/mypage");
    }
  };
  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.closeButton} onClick={closeSidebar}>
        ✕
      </div>

      <ul className={styles.menu}>
        {/* 공연 */}
        <li>
          <div className={styles.menuHeader} onClick={() => go("/main")}>
            <span>공연 & 행사</span>
          </div>
        </li>
        {/* <li>
          <div
            className={styles.menuHeader}
            onClick={() => toggleDropdown("show")}
          >
            <span>공연</span>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="10"
                viewBox="0 0 18 10"
                fill="none"
              >
                <path
                  d="M0.817553 0.34642C1.0485 0.115473 1.32194 -7.29021e-07 1.63788 -7.15211e-07C1.9532 -7.01428e-07 2.22633 0.115473 2.45728 0.34642L9.22402 7.11316L16.0139 0.323325C16.2294 0.107775 16.4988 -6.56176e-08 16.8222 -5.14845e-08C17.1455 -3.73515e-08 17.4226 0.115473 17.6536 0.34642C17.8845 0.577367 18 0.850808 18 1.16674C18 1.48206 17.8845 1.7552 17.6536 1.98614L9.87067 9.74596C9.77829 9.83834 9.67821 9.90393 9.57044 9.94272C9.46266 9.98091 9.34719 10 9.22402 10C9.10085 10 8.98537 9.98091 8.8776 9.94272C8.76982 9.90393 8.66975 9.83834 8.57737 9.74596L0.794458 1.96305C0.578908 1.7475 0.471132 1.48206 0.471132 1.16674C0.471132 0.850808 0.586606 0.577366 0.817553 0.34642Z"
                  fill="#121212"
                />
              </svg>
            </span>
          </div>
          {openDropdown === "show" && (
            <div className={styles.submenu}>
              <div onClick={() => go("/main")}>공연</div>
              <div onClick={() => go("/show/experience")}>체험</div>
              <div onClick={() => go("/show/street")}>스트릿공연</div>
              <div onClick={() => go("/show/food")}>먹거리</div>
              <div onClick={() => go("/show/worship")}>예배</div>
            </div>
          )}
        </li> */}

        {/* 리크루팅 */}
        <li>
          <div className={styles.menuHeader} onClick={() => go("/recruiting")}>
            <span>리크루팅</span>
          </div>
        </li>

        {/* 동아리 */}
        <li>
          <div className={styles.menuHeader} onClick={() => go("/clubs")}>
            <span>동아리 목록</span>
          </div>
        </li>
        {/* <li>
          <div
            className={styles.menuHeader}
            onClick={() => toggleDropdown("club")}
          >
            <span>동아리</span>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="10"
                viewBox="0 0 18 10"
                fill="none"
              >
                <path
                  d="M0.817553 0.34642C1.0485 0.115473 1.32194 -7.29021e-07 1.63788 -7.15211e-07C1.9532 -7.01428e-07 2.22633 0.115473 2.45728 0.34642L9.22402 7.11316L16.0139 0.323325C16.2294 0.107775 16.4988 -6.56176e-08 16.8222 -5.14845e-08C17.1455 -3.73515e-08 17.4226 0.115473 17.6536 0.34642C17.8845 0.577367 18 0.850808 18 1.16674C18 1.48206 17.8845 1.7552 17.6536 1.98614L9.87067 9.74596C9.77829 9.83834 9.67821 9.90393 9.57044 9.94272C9.46266 9.98091 9.34719 10 9.22402 10C9.10085 10 8.98537 9.98091 8.8776 9.94272C8.76982 9.90393 8.66975 9.83834 8.57737 9.74596L0.794458 1.96305C0.578908 1.7475 0.471132 1.48206 0.471132 1.16674C0.471132 0.850808 0.586606 0.577366 0.817553 0.34642Z"
                  fill="#121212"
                />
              </svg>
            </span>
          </div>
          {openDropdown === "club" && (
            <div className={styles.submenu}>
              <div onClick={() => go("/clubs/performance")}>공연</div>
              <div onClick={() => go("/clubs/exhibit")}>전시</div>
              <div onClick={() => go("/clubs/religion")}>종교</div>
              <div onClick={() => go("/clubs/sports")}>체육</div>
              <div onClick={() => go("/clubs/study")}>학술</div>
              <div onClick={() => go("/clubs/volunteer")}>봉사</div>
              <div onClick={() => go("/clubs/legacy")}>전산</div>
            </div>
          )}
        </li> */}
        {isLoading ? (
          <li>
            <div className={styles.menuHeader}>로딩중...</div>
          </li>
        ) : isLoggedIn ? (
          <>
            {/* 마이페이지 */}
            <li onClick={handleMyPageClick}>
              <div className={styles.menuHeader}>마이페이지</div>
            </li>
          </>
        ) : (
          <>
            {/* 로그인 */}
            <li onClick={() => go("/login")}>
              <div className={styles.menuHeader}>로그인</div>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
