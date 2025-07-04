import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/LoginOverModal.module.css";
import Modal from "../Modal";

const LoginOverModal = () => {
  const navigate = useNavigate();
  const [isLoginOverModalOpen, setIsLoginOverModalOpen] = useState(false);

  const handleLoginOverConfirm = () => {
    setIsLoginOverModalOpen(false);
    localStorage.removeItem("jwt");
    navigate(`/login`);
  };

  return (
    <>
      <Modal
        isOpen={isLoginOverModalOpen}
        onClose={() => setIsLoginOverModalOpen(false)}
      >
        <div className={styles.modal_content}>
          <div className={styles.modal_top}>세션이 만료되었습니다.</div>
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
