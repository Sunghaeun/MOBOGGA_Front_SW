import React from "react";
import styles from "./styles/RecruitingCard.module.css";

import top from "../assets/main/topTape.svg";

function RecruitingCard({ show, onClick }) {
  return (
    <div className={styles.showCard} onClick={onClick}>
      <img src={top} alt="" className={styles.top} />
      <div className={styles.card}>
        <img src={show.poster} alt={show.club} className={styles.mainImg}/>
      </div>
      <span className={styles.name}>{show.clubName}</span>
      {/* 여기에 정기/추가모집/상시모집 넣어야해유~ */}
      <div className={styles.secondline}>
        <span className={styles.recruitingType}>{show.category}</span>
        <span className={styles.separator}>|</span>
        <span className={styles.title}>{show.recruitingTitle}</span>
      </div>
    </div>
  );
}

export default RecruitingCard;