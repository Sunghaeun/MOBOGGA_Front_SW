import styles from "./EditCheckModal.module.css";
import React, { useState } from "react";

import closeButton from "../../assets/modal/x.svg";

import EditCompleteModal from "./EditCompleteModal";


const EditCheckModal = (props) => {
  const { open, close } = props;

    // 1) 리쿠르팅 생성 완료 모달
    // const [editCompleteModalOpen, setEditCompleteModalOpen] = useState(false);
    // const openEditCompleteModal = () => setEditCompleteModalOpen(true);
    // const closeEditCompleteModal = () => {
    //   setEditCompleteModalOpen(false);
    //   close();
    //   document.body.style.removeProperty('overflow');
    // };
    const [editCompleteModalOpen, setEditCompleteModalOpen] = useState(false);

  const handleCreate = () => {
    setEditCompleteModalOpen(true);
    close();
    document.body.style.removeProperty('overflow');
  };
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
              <span>리크루팅을 생성하시겠어요?</span>
              <p>마이페이지에서 수정 가능합니다.</p>
            </div>
            <div className={styles.bottomContainer}>
              <div className={styles.button} onClick={close}>
                <span>취소</span>
              </div>
              <div className={styles.button1} onClick={handleCreate}>
                <span>생성하기</span>
              </div>
            </div>
          </main>
        </section>
      ) : null}
    </div>
            <EditCompleteModal
          open={editCompleteModalOpen}
          close={() => setEditCompleteModalOpen(false)}
        
        />
        </>
  );
};

export default EditCheckModal;
