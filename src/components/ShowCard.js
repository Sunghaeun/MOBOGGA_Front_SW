import React from "react";
import styles from "./styles/ShowCard.module.css";

// import top1 from "../assets/main/topTape.svg";
// import top2 from "../assets/main/topTape2.svg";

// import side1 from "../assets/main/sideTape.svg";
// import side2 from "../assets/main/sideTape2.svg";



function ShowCard({ show , onClick }) {
  return (
    <div className={styles.showCard} onClick={onClick}>
      <div className={styles.card}>
        <img src={show.photo} alt={show.name} className={styles.mainImg}/>
        {/* <img src={top1} alt="" className={`${show.category === "공연" ? styles.top : styles.hide}`}/> 
        <img src={top2} alt="" className={`${show.category === "즐길거리" ? styles.top1 : styles.hide}`}/>  */}
        {/* <img src={side1} alt="" className={`${show.category === "공연" ? styles.side : styles.hide}`}/>
        <img src={side2} alt="" className={`${show.category === "즐길거리" ? styles.side1 : styles.hide}`}/>  */}
        {/* <span className={`${styles.category} ${show.category === "즐길거리" ? styles.category1 : ""}`}>{show.category}</span> 
        <span className={`${styles.tag}
          ${show.tag.length === 1 ? styles.tag1 : ""}
          ${show.tag.length === 3 ? styles.tag3 : ""}
          ${show.tag.length === 4 ? styles.tag4 : ""}
          ${show.tag.length >= 5 ? styles.tag5 : ""}`
          }>{show.tag}</span> */}

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
