import React, { useEffect, useState } from "react";
import styles from "./styles/Banner.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Banner() {
  const [show, setShow] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getShow = async () => {
      const token = localStorage.getItem("jwt");
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/attraction/list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("rotatingPerformances 데이터 가져오기 성공");
        console.log(res.data.rotatingPerformances);
        console.log(res.data.rotatingPerformances[1]);
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
        console.error("API 불러오기 실패", err);
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

  const current = show[currentIndex];

  return (
    <div className={styles.banner}>
      <div className={styles.text}>
        <span>오늘의 추천</span>
      </div>
      <div className={styles.container}>
        <div className={styles.leftImg}>
          <img
            src={current.photo}
            alt={current.name}
            className={`${styles.fade} ${fade ? styles.show : ""}`}
            onClick={() =>
              navigate(
                `${
                  current.category === "공연"
                    ? `/show/${current.id}`
                    : `/entertain/${current.id}`
                }`
              )
            }
          />
        </div>

        <div className={styles.rightContainer}>
          <div
            className={`${styles.textContainer} ${styles.fade} ${
              fade ? styles.show : ""
            }`}
          >
            <span className={styles.clubName}>{current.clubID}</span>
            <span
              className={styles.name}
              onClick={() =>
                navigate(
                  `${
                    current.category === "공연"
                      ? `/show/${current.id}`
                      : `/entertain/${current.id}`
                  }`
                )
              }
            >
              {current.name}
            </span>
            <span className={styles.date}>{current.period}</span>
          </div>

          <div className={styles.imgContainer}>
            <div className={styles.imgBox}>
              <img
                src={show[0].photo}
                alt="banner1"
                onClick={() =>
                  navigate(
                    `${
                      show[0].category === "공연"
                        ? `/show/${show[0].id}`
                        : `/entertain/${show[0].id}`
                    }`
                  )
                }
              />
            </div>
            <div className={styles.imgBox}>
              <img
                src={show[1].photo}
                alt="banner2"
                onClick={() =>
                  navigate(
                    `${
                      show[1].category === "공연"
                        ? `/show/${show[1].id}`
                        : `/entertain/${show[1].id}`
                    }`
                  )
                }
              />
            </div>
            <div className={styles.imgBox}>
              <img
                src={show[2].photo}
                alt="banner3"
                onClick={() =>
                  navigate(
                    `${
                      show[2].category === "공연"
                        ? `/show/${show[2].id}`
                        : `/entertain/${show[2].id}`
                    }`
                  )
                }
              />
            </div>
            <div className={styles.imgBox}>
              <img
                src={show[3].photo}
                alt="banner4"
                onClick={() =>
                  navigate(
                    `${
                      show[3].category === "공연"
                        ? `/show/${show[3].id}`
                        : `/entertain/${show[3].id}`
                    }`
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
