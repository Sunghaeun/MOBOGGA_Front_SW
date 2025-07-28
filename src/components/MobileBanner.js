import React, { useEffect, useState } from "react";
import styles from "./styles/MobileBanner.module.css";
import axios from "axios";
import { useNavigate} from "react-router-dom";




function Banner() {

//   const [show, setShow] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [fade, setFade] = useState(true);
//   const navigate = useNavigate();


// useEffect(() => {
//   const getShow = async () => {
//     try {
//       const res = await axios.get(`${process.env.REACT_APP_API_URL}/attraction/list`);
//       console.log("rotatingPerformances 데이터 가져오기 성공");
//       console.log(res.data.rotatingPerformances);
//       console.log(res.data.rotatingPerformances[1]);
//       const converted = res.data.rotatingPerformances.map((item) => ({
//         id: item.id,
//         name: item.title,
//         clubID: item.club,
//         period: item.period,
//         category: item.category,
//         photo: item.img?.trim() || "", // 이미지 없을 때 대비
//       }));
//       setShow(converted);
//     } catch (err) {
//       console.error("API 불러오기 실패", err);
//     }
//   };
//   getShow();
// }, []);

// useEffect(() => {
//   if (show.length === 0) return;

//   const interval = setInterval(() => {
//     setFade(false);
//     setTimeout(() => {
//       setCurrentIndex((prev) => (prev + 1) % show.length);
//       setFade(true);
//     }, 1000);
//   }, 10000);

//   return () => clearInterval(interval);
// }, [show]);

// if (show.length === 0) {
//   return <div className={styles.banner}>Loading...</div>;
// }

// const current = show[currentIndex];

  return (
    <div className={styles.banner}>
      <div className={styles.text}>
        <span>오늘의 추천</span>
      </div>
      <div className={styles.container}>
        
      </div>
    </div>
  );
}

export default Banner;
