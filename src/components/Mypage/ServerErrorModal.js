/* eslint-disable */
import { useState } from "react";
import styles from "./styles/LoginOverModal.module.css";
import Modal from "../Modal";

const ServerErrorModal = ({ isOpen, onClose, errorMessage }) => {
  const handleErrorConfirm = () => {
    console.log("서버 에러 모달 닫기");
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className={styles.modal_content}>
          <div className={styles.modal_top}>서버 연결 오류</div>
          <div className={styles.modal_con}>
            {errorMessage ||
              "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하거나 관리자에게 문의해주세요."}
          </div>
          <div className={styles.modal_Btns}>
            <button
              onClick={handleErrorConfirm}
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

export default ServerErrorModal;
