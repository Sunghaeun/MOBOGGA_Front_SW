import React from "react";
import styles from "./styles/ClubCard.module.css";

import top from "../assets/main/topTape.svg";


function ClubCard({ show , onClick }) {
  return (
    <>
      <div className={styles.clubCard} onClick={onClick}>
        <img src={top} alt="" className={styles.top}/> 
        <div className={styles.clubImg}>
          <img src={show.poster} alt={show.clubName} className={styles.mainImg} />
        </div>
        <span className={styles.name}>{show.clubName}</span>
      </div>
    </>
  );
}

export default ClubCard;