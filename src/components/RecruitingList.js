// eslint-disable-next-line
import React, { useState, useEffect } from "react";
import RecruitingCard from "./RecruitingCard";
import styles from "./styles/RecruitingList.module.css";
import loadingStyles from "../styles/Loading.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

import back from "../assets/icons/back.svg";

function RecruitingList() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

// 4) 관리자 권한 받아오기 - Hooks를 최상위로 이동
  const { user, isManager, initialize } = useAuthStore();

  // 앱 진입 시 토큰이 있으면 사용자 정보 조회 (onRehydrateStorage에서도 호출되지만 안전하게 한 번 더)
  useEffect(() => {
    initialize?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  

  // 1) recruiting 데이터 가져오기
  const [recruiting, setRecruiting] = useState([]);
  const getRecruiting = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/recruiting/list`
      );
      console.log("recruiting 데이터 가져오기 성공");
      console.log(res.data);
      setRecruiting(res.data.recruitingList);
    } catch (err) {
      console.error(err);
      setError("리크루팅 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };
  // 2) 페이지 로드되면 recruiting값 불러옴

  useEffect(() => {
    getRecruiting();
  }, []);

  //3) 가져온 데이터별 카테고리 별로 필터링
  const filteredList =
    selectedCategory === "전체"
      ? recruiting
      : recruiting.filter((item) => item.category === selectedCategory);

  if (isLoading) {
    return (
      <div className={loadingStyles.loading}>
        <div className={loadingStyles.loadingSpinner}></div>
        <div className={loadingStyles.loadingText}>
          리크루팅 목록을 불러오고 있습니다
          <span className={loadingStyles.loadingDots}>...</span>
        </div>
        <div className={loadingStyles.loadingSubtext}>잠시만 기다려주세요</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={loadingStyles.error}>
        <div className={loadingStyles.errorIcon}>⚠️</div>
        <div className={loadingStyles.errorMessage}>{error}</div>
        <button
          onClick={() => getRecruiting()}
          className={loadingStyles.retryBtn}
        >
          🔄 다시 시도
        </button>
      </div>
    );
  }


  return (
    <div className={styles.column}>
      <div className={styles.categoryHeader}>
        <img src={back} alt="back" />
        <span className={styles.title}>카테고리</span>
      </div>
      <div className={styles.buttons}>
        <div className={styles.category}>
          {["전체", "정기모집", "추가모집", "상시모집"].map((category, idx) => (
            <div
              key={idx}
              className={
                selectedCategory === category
                  ? styles.activeCategory
                  : styles.inactiveCategory
              }
              onClick={() => setSelectedCategory(category)}
            >
              <span>{category}</span>
            </div>
          ))}
        </div>

        {isManager?.() && (
          <div className={styles.createButton} onClick={() => navigate("/recruiting/create")}>
            <span>리쿠르팅 새로 만들기</span>
          </div>
        )}
      </div>

      <div className={styles.recruitingList}>
        {filteredList.map((item, index) => (
          <RecruitingCard
            key={index}
            show={item}
            onClick={() => navigate(`/recruiting/${item.recruitingId}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default RecruitingList;
