import React from "react";
import styles from "./styles/ProfileTooltip.module.css";

function ProfileTooltip({ auth, isVisible, onClose }) {
  if (!isVisible || !auth) return null;

  return (
    <div className={styles.tooltip}>
      <div className={styles.header}>
        <h3 className={styles.name}>{auth.clubName || "동아리명"}</h3>
      </div>
      <div className={styles.info}>
        <div className={styles.email}>{auth.email || "이메일 정보 없음"}</div>
        <div className={styles.club}>
          동아리장: {auth.name || "이름 없음"}
        </div>
        <div className={styles.contact}>
          연락처: {auth.phoneNumber || "전화번호 없음"}
        </div>
      </div>
      <button className={styles.profileButton} onClick={onClose}>
        프로필 정보 수정
      </button>
      <div className={styles.logout}>로그아웃</div>
    </div>
  );
}

export default ProfileTooltip;
