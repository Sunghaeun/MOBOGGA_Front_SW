import styles from "./NotEnteredModal.module.css";
import React from "react";

import closeButton from "../../assets/modal/x.svg";

const NotEnteredModal = (props) => {
  const { open, close } = props;

  return (
    <div 
      className={open ? `${styles.openModal} ${styles.modal}` : styles.modal} 
      onClick={close} // 모달 바깥 클릭 시 닫힘
    >
      {open && props !== null ? (
        <section onClick={(e) => e.stopPropagation()}>
          <main>
            <img className={styles.closeB} src={closeButton} alt="Close" onClick={close}/>
            <div className={styles.topContainer}>
              <span>누락된 정보를 확인해주세요.</span>
            </div>
            <div className={styles.bottomContainer}>
              <div className={styles.button} onClick={close}>
                <span>확인</span>
              </div>
            </div>
          </main>
        </section>
      ) : null}
    </div>
  );
};

export default NotEnteredModal;
