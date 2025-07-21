import styles from "./EditCheckModal.module.css";
import React from "react";

import closeButton from "../../assets/modal/x.svg";

const EditCompleteModal = (props) => {
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
              <span>리크루팅 생성이 완료되었습니다!</span>
              <p>마이페이지에서 수정 가능합니다.</p>
            </div>
            <div className={styles.bottomContainer}>
              <div className={styles.button1} onClick={close}>
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
