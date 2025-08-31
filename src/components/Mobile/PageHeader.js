import React from "react";
import styles from "./styles/PageHeader.module.css";

import back from "../../assets/ShowBackButton.svg";

function Clubs({title = ""}) {
  return (
    <>
      <div className={styles.main}>
        <img src={back} alt="Back" className={styles.backButton} />
        <span className={styles.categoryText}>{title}</span>
      </div>
    </>
  );
}

export default Clubs;