import React from "react";
import styles from "./styles/ShowCard.module.css";
import ExpTape from "../assets/tape/exp_tape.svg";
import FoodTape from "../assets/tape/food_tape.svg";
import ShowTape from "../assets/tape/show_tape.svg";
import StreetTape from "../assets/tape/street_tape.svg";
import WorshipTape from "../assets/tape/worship_tape.svg";

function ShowCard({ show, onClick }) {
  return (
    <div className={styles.showCard} onClick={onClick}>
      <div className={styles.tape}>
        {show.category === "체험" && <img src={ExpTape} alt="체험" />}
        {show.category === "먹거리" && <img src={FoodTape} alt="먹거리" />}
        {show.category === "공연" && <img src={ShowTape} alt="공연" />}
        {show.category === "스트릿공연" && <img src={StreetTape} alt="스트릿공연" />}
        {show.category === "예배" && <img src={WorshipTape} alt="예배" />}
      </div>
      <img src={show.photo} alt={show.name} className={styles.mainImg} />
      <div className={styles.name}>
        <span>{show.name}</span>
      </div>

      <div className={styles.clubDate}>
        <span
          className={`${styles.club} ${
            show.category === "공연" ? styles.tagdetail : ""
          }`}
        >
          {show.clubID}
        </span>
        <span>|</span>
        <span className={styles.date}>{show.startDate}</span>
        <span>{" - "}</span>
        <span className={styles.date1}>{show.endDate}</span>
      </div>
    </div>
  );
}

export default ShowCard;
