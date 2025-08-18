import React, { useEffect, useState, useRef } from "react";
import styles from "./styles/Banner.module.css";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";

import top from "../assets/main/topTape.svg";
import defaultImg from "../assets/main/default.svg";

function Banner() {
  const [show, setShow] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [isPaused, setIsPaused] = useState(false); // 자동 전환 일시정지
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  useEffect(() => {
    const getShow = async () => {
      try {
        const res = await apiClient.get("/attraction/list");
        const converted = (res?.data?.rotatingPerformances || []).map((item) => ({
          id: item.id,
          name: item.title,
          clubID: item.club,
          period: item.period,
          category: item.category,
          photo: item.img?.trim() || "",
        }));
        setShow(converted);
      } catch (err) {
        console.error("API 불러오기 실패", err);
      }
    };
    getShow();
  }, []);

  // 자동 로테이션
  useEffect(() => {
    if (show.length === 0) return;

    // 기존 타이머 정리
    if (intervalRef.current) clearInterval(intervalRef.current);

    // 일시정지 상태면 타이머 만들지 않음
    if (isPaused) return;

    intervalRef.current = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % show.length);
        setFade(true);
      }, 250); // 페이드 전환 딜레이 약간 줄임
    }, 8000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [show, isPaused]);

  const safeShow = (i) => show[i] ?? {};

  // 썸네일에 마우스 올렸을 때 해당 인덱스로 즉시 변경
  const handleThumbEnter = (i) => {
    if (!show[i]) return;
    setIsPaused(true);    // 자동 전환 멈춤
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(i);
      setFade(true);
    }, 120);
  };

  // 썸네일에서 마우스가 빠지면 자동 전환 재개
  const handleThumbLeave = () => {
    setIsPaused(false);
  };

  // 키보드 접근성(탭 포커스)도 고려
  const handleThumbFocus = (i) => handleThumbEnter(i);
  const handleThumbBlur = handleThumbLeave;

  if (show.length === 0) {
    return <div className={styles.banner}>Loading...</div>;
  }

  const current = show[currentIndex];

  const goDetail = (item) => {
    if (!item) return;
    navigate(item.category === "공연" ? `/show/${item.id}` : `/entertain/${item.id}`);
  };

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
            onClick={() => goDetail(current)}
            draggable="false"
          />
        </div>

        <div className={styles.rightContainer}>
          <div
            className={`${styles.textContainer} ${styles.fade} ${
              fade ? styles.show : ""
            }`}
          >
            <span className={styles.clubName}>{current.clubID}</span>
            <span className={styles.name} onClick={() => goDetail(current)}>
              {current.name}
            </span>
            <span className={styles.date}>{current.period}</span>
          </div>

          <div className={styles.imgContainer}>
            {[0, 1, 2, 3].map((i) => {
              const item = safeShow(i);
              if (!item.photo) return null; // 안전장치
              return (
                <div
                  key={i}
                  className={`${styles.imgBox} ${
                    currentIndex === i ? styles.activeThumb : ""
                  }`}
                  onMouseEnter={() => handleThumbEnter(i)}
                  onMouseLeave={handleThumbLeave}
                  onFocus={() => handleThumbFocus(i)}
                  onBlur={handleThumbBlur}
                  role="button"
                  tabIndex={0}
                  aria-label={`${item.name} 미리보기`}
                >
                  <img src={defaultImg} alt="" className={styles.default} />
                  <img src={top} alt="" className={styles.top} />
                  <img
                    src={item.photo}
                    alt={`banner${i + 1}`}
                    className={styles.thumb}
                    onClick={() => goDetail(item)}
                    draggable="false"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
