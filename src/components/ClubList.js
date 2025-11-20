import React, { useState, useEffect, useMemo } from "react";
import ClubCard from "./ClubCard";
import styles from "./styles/ClubList.module.css";
import loadingStyles from "../styles/Loading.module.css";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

function ClubList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  //1) 카테고리 별 분류
  const [selectedCategory, setSelectedCategory] = useState("공연");

  // URL에서 category 파라미터를 메모이제이션하여 최적화
  const categoryFromUrl = useMemo(() => {
    return searchParams.get("category");
  }, [searchParams]);

  // URL에서 category 파라미터 읽어서 초기 카테고리 설정
  useEffect(() => {
    if (categoryFromUrl) {
      const categoryMap = {
        performance: "공연",
        sports: "체육",
        religion: "종교",
        study: "학술",
        exhibit: "전시",
        volunteer: "봉사",
        legacy: "전산",
      };
      const mappedCategory = categoryMap[categoryFromUrl];
      if (mappedCategory) {
        setSelectedCategory(mappedCategory);
      }
    }
  }, [categoryFromUrl]);

  // 1) club 데이터 가져오기
  const [club, setClub] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const getClub = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await axios.get(`${process.env.REACT_APP_API_URL}test/club/list`);
      setClub(res.data.clubList);
    } catch (err) {
      setError("동아리 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };
  // 2) 페이지 로드되면 club값 불러옴

  useEffect(() => {
    getClub();
  }, []);

  //3) 가져온 데이터별 카테고리 별로 필터링
  const filteredList = club.filter(
    (item) => item.category === selectedCategory
  );

  if (isLoading) {
    return (
      <div className={loadingStyles.loading}>
        <div className={loadingStyles.loadingSpinner}></div>
        <div className={loadingStyles.loadingText}>
          동아리 목록을 불러오고 있습니다
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
        <button onClick={() => getClub()} className={loadingStyles.retryBtn}>
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className={styles.column}>
      <div className={styles.title}>카테고리</div>
      <div className={styles.buttons}>
        <div className={styles.category}>
          {["공연", "체육", "종교", "학술", "전시", "봉사", "전산"].map(
            (category, idx) => (
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
            )
          )}
        </div>
      </div>
      <div className={styles.showlist}>
        {filteredList.map((item) => (
          <ClubCard
            key={item.id}
            show={item}
            className={styles.showCard}
            onClick={() => navigate(`/clubs/${item.clubId}`)}
          />
        ))}
        {filteredList.length === 0 && (
          <div className={styles.noData}>
            해당 카테고리의 동아리가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

export default ClubList;
