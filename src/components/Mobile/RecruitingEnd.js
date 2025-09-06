/* eslint-disable */
import styles from "./styles/RecruitingEnd.module.css";
import React, { useState } from "react";

import closeButton from "../../assets/modal/x.svg";


const RecruitingEndModal = (props) => {
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
            <div className={styles.topContainer}>
              <span>지원이 마감되었습니다.</span>
            </div>
            <div className={styles.bottomContainer} onClick={close}>
              <span>확인</span>
            </div>
          </main>
        </section>
      ) : null}
    </div>

        </>
  );
};

export default RecruitingEndModal;
