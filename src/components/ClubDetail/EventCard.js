import React from "react";
import styles from "./EventCard.module.css";

function EventCard({ show, onClick }) {
  return (
    <div className={styles.showCard} onClick={onClick}>
      <div className={styles.card}>
        <img
          src={show.poster}
          alt={show.name}
          className={`${styles.mainImg} ${styles.imgdetail}`}
        />
      </div>
      <span className={styles.name}>{show.title}</span>
      <div className={styles.clubDate}>
        <span className={styles.date}>{show.startDate}</span>
        <span>{" - "}</span>
        <span className={styles.date1}>{show.endDate}</span>
      </div>
    </div>
  );
}

export default EventCard;
