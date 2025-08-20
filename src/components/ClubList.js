import React, { useState, useEffect } from "react";
import ClubCard from "./ClubCard";
import styles from "./styles/ClubList.module.css";
import loadingStyles from "../styles/Loading.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ClubList() {
  const navigate = useNavigate();

  //1) 카테고리 별 분류
  const [selectedCategory, setSelectedCategory] = useState("공연");

  // 1) club 데이터 가져오기
  const [club, setClub] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const getClub = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/club/list`);
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
          🔄 다시 시도
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={styles.column}>
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
    </>
  );
}

export default ClubList;
