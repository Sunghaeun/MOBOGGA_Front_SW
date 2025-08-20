import React, { useEffect, useState } from "react";
import styles from "./styles/MobileBanner.module.css";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";

function MobileBanner() {
  const [show, setShow] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getShow = async () => {
      try {
        const res = await apiClient.get("/attraction/list");
        const converted = res.data.rotatingPerformances.map((item) => ({
          id: item.id,
          name: item.title,
          clubID: item.club,
          period: item.period,
          category: item.category,
          photo: item.img?.trim() || "", // 이미지 없을 때 대비
        }));
        setShow(converted);
      } catch (err) {
        // API 호출 실패: 사용자에게 에러 표시 대신 빈 배너 유지
      }
    };
    getShow();
  }, []);

  useEffect(() => {
    if (show.length === 0) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % show.length);
        setFade(true);
      }, 1000);
    }, 10000);

    return () => clearInterval(interval);
  }, [show]);

  if (show.length === 0) {
    return <div className={styles.banner}>Loading...</div>;
  }

  const len = show.length;
  const prev2 = show[(currentIndex - 2 + len) % len];
  const prev1 = show[(currentIndex - 1 + len) % len];
  const next1 = show[(currentIndex + 1) % len];
  const next2 = show[(currentIndex + 2) % len];
  const current = show[currentIndex];

  return (
    <div className={styles.banner}>
      <div className={styles.text}>
        <span>오늘의 추천</span>
      </div>

      <div className={styles.container}>
        <div className={`${styles.imgBox1} ${styles.miniImgBox}`}>
          <img
            src={prev2.photo}
            alt="banner1"
            onClick={() =>
              navigate(
                prev2.category === "공연"
                  ? `/show/${prev2.id}`
                  : `/entertain/${prev2.id}`
              )
            }
          />
        </div>

        <div className={`${styles.imgBox2} ${styles.imgBox}`}>
          <img
            src={prev1.photo}
            alt="banner2"
            onClick={() =>
              navigate(
                prev1.category === "공연"
                  ? `/show/${prev1.id}`
                  : `/entertain/${prev1.id}`
              )
            }
          />
        </div>

        <div className={styles.MainImg}>
          <div className={styles.overlay}></div> {/* ✅ 그라데이션 오버레이 */}
          <img
            src={current.photo}
            alt={current.name}
            className={`${styles.fade} ${fade ? styles.show : ""}`}
            onClick={() =>
              navigate(
                current.category === "공연"
                  ? `/show/${current.id}`
                  : `/entertain/${current.id}`
              )
            }
          />
          <span className={styles.name}>{current.name}</span>
          <span className={styles.date}>{current.period}</span>
          <span className={styles.clubName}>{current.clubID}</span>
        </div>

        <div className={`${styles.imgBox3} ${styles.imgBox}`}>
          <img
            src={next1.photo}
            alt="banner3"
            onClick={() =>
              navigate(
                next1.category === "공연"
                  ? `/show/${next1.id}`
                  : `/entertain/${next1.id}`
              )
            }
          />
        </div>

        <div className={`${styles.imgBox4} ${styles.miniImgBox}`}>
          <img
            src={next2.photo}
            alt="banner4"
            onClick={() =>
              navigate(
                next2.category === "공연"
                  ? `/show/${next2.id}`
                  : `/entertain/${next2.id}`
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

export default MobileBanner;
