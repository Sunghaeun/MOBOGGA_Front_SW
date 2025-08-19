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
