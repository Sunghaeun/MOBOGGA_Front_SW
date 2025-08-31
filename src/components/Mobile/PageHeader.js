import React from "react";
import styles from "./styles/PageHeader.module.css";
import { useNavigate } from "react-router-dom";

import back from "../../assets/ShowBackButton.svg";

function Clubs({title = ""}) {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.main}>
        <img src={back} alt="Back" className={styles.backButton} onClick={() => navigate(-1)} />
        <span className={styles.categoryText}>{title}</span>
      </div>
    </>
  );
}

export default Clubs;