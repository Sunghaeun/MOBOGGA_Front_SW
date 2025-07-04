import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/LogoutModal.module.css";
import Modal from "../Modal";

const LogoutModal = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    navigate(`/logout`);
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
    navigate(`/mypage`);
  };

  return (
    <Modal
      isOpen={isLogoutModalOpen}
      onClose={() => setIsLogoutModalOpen(false)}
    >
      <div className={styles.modal_content}>
        <div className={styles.modal_top}>로그아웃하시겠습니까?</div>
        <div className={styles.modal_Btns}>
          <button
            onClick={handleLogoutCancel}
            className={styles.modal_close_Btn}
          >
            취소
          </button>
          <button onClick={handleLogoutConfirm} className={styles.modal_ok_Btn}>
            확인
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default LogoutModal;
