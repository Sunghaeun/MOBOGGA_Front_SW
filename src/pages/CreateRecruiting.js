import React from "react";
import styles from "./styles/CreateRecruiting.module.css";


function CreateRecruiting() {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.title}>
          <span>리쿠르팅 새로 만들기</span>
        </div>

        <div className={styles.inputContainer}>
          
        </div>

        <div className={styles.buttonContainer}>
          <div className={styles.createClub}>
            <span>리쿠르팅 만들기</span>
          </div>
        </div>

      </div>
    </>
  );
}

export default CreateRecruiting;