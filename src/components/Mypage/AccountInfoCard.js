import { useState } from "react";
import styles from "./styles/AccountInfoCard.module.css";
import LogoutModal from "./LogoutModal"; // Assuming you have a LogoutModal component

function AccountInfoCard({ formData }) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isHoveringLogoutBtn, setIsHoveringLogoutBtn] = useState(false);

  const onClickLogoutBtn = () => {
    setIsLogoutModalOpen(true);
  };

  const onMouseOverLogoutBtn = () => {
    setIsHoveringLogoutBtn(true);
  };
  const onMouseOutLogoutBtn = () => {
    setIsHoveringLogoutBtn(false);
  };

  return (
    <div className={styles.accountInfoCard}>
      <div className={styles.account_info_box}>
        <div className={styles.account_title_box}>
          <div className={styles.account_title}>현재 로그인 계정</div>
        </div>
        <div className={styles.account}>{formData.email}</div>
        <div
          className={
            isHoveringLogoutBtn
              ? styles.LogoutBtnHover
              : styles.LogoutBtnDefault
          }
          onClick={onClickLogoutBtn}
          onMouseOver={onMouseOverLogoutBtn}
          onMouseOut={onMouseOutLogoutBtn}
        >
          로그아웃
        </div>
      </div>
      {isLogoutModalOpen && (
        <LogoutModal onClose={() => setIsLogoutModalOpen(false)} />
      )}
    </div>
  );
}

export default AccountInfoCard;
