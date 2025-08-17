/* eslint-disable */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/LoginOverModal.module.css";
import Modal from "../Modal";
import useAuthStore from "../../stores/authStore";

const LoginOverModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLoginOverConfirm = async () => {
    // Zustand 스토어를 통한 완전한 로그아웃
    await logout();

    // OAuth 관련 세션 데이터 정리
    sessionStorage.removeItem("oauth_state");
    sessionStorage.removeItem("oauth_nonce");

    console.log("로그아웃 완료 - 로그인 페이지로 이동");
    navigate(`/login`);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className={styles.modal_content}>
          <div className={styles.modal_top}>
            로그인 정보가 없거나 세션이 만료되었습니다.
          </div>
          <div className={styles.modal_con}>다시 로그인해주세요.</div>
          <div className={styles.modal_Btns}>
            <button
              onClick={handleLoginOverConfirm}
              className={styles.modal_ok_Btn}
            >
              확인
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LoginOverModal;
