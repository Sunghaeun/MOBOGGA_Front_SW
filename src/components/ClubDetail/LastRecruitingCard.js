import React from "react";
import styles from "./LastRecruitingCard.module.css";

function LastRecruitingCard({ show ,onClick }) {
  return (
    <div className={styles.showCard} onClick={onClick}>
      <div className={styles.card}>
        <img src={show.poster} alt={show.club} className={styles.mainImg}/>
      </div>
      <span className={styles.name}>{show.period}</span>
    </div>
  );
}

export default LastRecruitingCard;