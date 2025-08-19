import React from "react";
import styles from "./styles/ShowCard.module.css";


function ShowCard({ show , onClick }) {
  return (
    <div className={styles.showCard} onClick={onClick}>
      <div className={styles.card}>
        <img src={show.photo} alt={show.name} className={styles.mainImg}/>

      </div>
      <div className={styles.name}>
          <span>{show.name}</span> 
      </div>
    
      <div className={styles.clubDate}>
        <span className={`${styles.club} ${show.category === "공연" ? styles.tagdetail : ""}`}>{show.clubID}</span>
        <span>|</span>
        <span className={styles.date}>{show.startDate}</span>
        <span >{" - "}</span>
        <span className={styles.date1}>{show.endDate}</span>
      </div>
    </div>
  );
}

export default ShowCard;
