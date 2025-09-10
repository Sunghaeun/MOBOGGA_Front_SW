/* eslint-disable */
import styles from "./EditCheckModal.module.css";
import React, { useState } from "react";

import closeButton from "../../assets/modal/x.svg";


const PageOutModal = (props) => {
  const { open, close } = props;

  return (
    <>
    <div 
      className={open ? `${styles.openModal} ${styles.modal}` : styles.modal} 
      onClick={close} // 모달 바깥 클릭 시 닫힘
    >
      {open && props !== null ? (
        <section onClick={(e) => e.stopPropagation()}>
          <main>
            <img className={styles.closeB} src={closeButton} alt="Close" onClick={close}/>
            <div className={styles.topContainer}>
              <span>이 페이지에서 나가시겠습니까?</span>
              <p>이 페이지를 벗어나면 작성 중인 내용은 저장되지 않습니다.</p>
            </div>
            <div className={styles.bottomContainer}>
              <div className={styles.button} onClick={close}>
                <span>취소</span>
              </div>
              <div className={styles.button1} >
                <span>나가기</span>
              </div>
            </div>
          </main>
        </section>
      ) : null}
    </div>

        </>
  );
};

export default PageOutModal;
