import styles from "./EditCheckModal.module.css";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import closeButton from "../../assets/modal/x.svg";

const EditCompleteModal = (props) => {
  const { open, close, delayMs = 600 } = props; 
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const handleCloseAndNavigate = () => {
    // 모달 닫기
    close?.();

    // 이전 타이머 정리(중복 클릭 대비)
    if (timerRef.current) clearTimeout(timerRef.current);

    // delay 후 이동
    timerRef.current = setTimeout(() => {
      navigate("/manager/recruiting");
    }, delayMs);
  };

  // 언마운트/재오픈 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className={open ? `${styles.openModal} ${styles.modal}` : styles.modal}
      onClick={close} // 배경 클릭 시 닫기
    >
      {open ? (
        <section onClick={(e) => e.stopPropagation()}>
          <main>
            <img
              className={styles.closeB}
              src={closeButton}
              alt="Close"
              onClick={close}
            />
            <div className={styles.topContainer}>
              <span>리크루팅 생성이 완료되었습니다!</span>
              <p>마이페이지에서 수정 가능합니다.</p>
            </div>
            <div className={styles.bottomContainer}>
              <div className={styles.button1} onClick={handleCloseAndNavigate}>
                <span>확인</span>
              </div>
            </div>
          </main>
        </section>
      ) : null}
    </div>
  );
};

export default EditCompleteModal;
