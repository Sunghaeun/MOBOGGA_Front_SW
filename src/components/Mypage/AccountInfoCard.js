import { useState } from "react";
import styles from "./styles/AccountInfoCard.module.css";

function AccountInfoCard({ userInfo, formData }) {
  const [, setIsLogoutModalOpen] = useState(false);
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
    </div>
  );
}

export default AccountInfoCard;
