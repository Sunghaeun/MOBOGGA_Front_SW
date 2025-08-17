import React, { useState, useEffect } from "react";
import ShowCard from "./ShowCard";
import styles from "./styles/ShowList.module.css";
import loadingStyles from "../styles/Loading.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import image1 from "../assets/mainTest/1.png";

function ShowList() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [show, setShow] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("새로 만들기");

  // 4) 관리자 권한 받아오기 - Hooks를 최상위로 이동
  const [auth, setAuth] = useState([]);

  // 관리자 권한 체크 함수 - useEffect보다 먼저 선언
  const isManager = () => {
    return auth && auth.authority === "ROLE_CLUB";
  };

  // 1) show 데이터 가져오기
  const getShow = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/attraction/list`,
        {
          timeout: 10000, // 10초 타임아웃
        }
      );
      console.log("📥 Raw response from /attraction/list:", res.data);

      const converted = res.data.entireList.map((item) => {
        const [startDate, endDate] = item.period.split(" - ");
        return {
          id: item.id,
          name: item.title,
          clubID: item.club,
          startDate,
          endDate,
          tag: item.tag,
          category: item.category || "기타",
          photo: item.img?.trim() || image1,
        };
      });
      setShow(converted);
    } catch (err) {
      console.log("데이터 가져오기 실패:", err);
      setError("공연 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // Auth 함수도 최상위로 이동
  const getAuth = async () => {
    try {
      const token = localStorage.getItem("jwt"); // 저장된 토큰 불러오기

      // 토큰이 없으면 권한 체크를 건너뛰기
      if (!token) {
        console.log("No token found, skipping auth check");
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 헤더에 토큰 추가
          },
          withCredentials: true,
          timeout: 10000, // 10초 타임아웃
        }
      );

      console.log("Response from backend:", response.data);
      setAuth(response.data);
    } catch (error) {
      console.error("Auth check failed:", error);

      // 401/403 에러의 경우 토큰 제거
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("jwt");
        setAuth(null);
      }

      // 네트워크 에러는 조용히 처리 (에러를 던지지 않음)
      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        console.log("Network error during auth check, continuing without auth");
        setAuth(null);
        return;
      }
    }
  };

  // 2) 페이지 로드되면 show값 불러옴
  useEffect(() => {
    getShow();
  }, []);

  useEffect(() => {
    console.log("현재 로그인한 사용자 권한:", auth);
    console.log("사용자 역할:", auth?.role);
    console.log("사용자 권한:", auth?.authority);
    console.log("관리자 여부:", auth && auth.authority === "ROLE_CLUB");
  }, [auth]);

  useEffect(() => {
    getAuth();
  }, []);

  // 3) 가져온 데이터별 카테고리 별로 필터링
  const filteredList =
    selectedCategory === "전체"
      ? show
      : show.filter((item) => item.category === selectedCategory);

  if (isLoading) {
    return (
      <div className={loadingStyles.loading}>
        <div className={loadingStyles.loadingSpinner}></div>
        <div className={loadingStyles.loadingText}>
          공연 목록을 불러오고 있습니다
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
        <button onClick={() => getShow()} className={loadingStyles.retryBtn}>
          🔄 다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className={styles.column}>
      <div className={styles.buttons}>
        <div className={styles.category}>
          {["전체", "공연", "체험", "스트릿공연", "먹거리", "예배"].map(
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

        {/* 드롭다운 !! - 관리자 및 동아리 관리자만 표시 */}
        {isManager() && (
          <>
            {dropdownOpen && (
              <div
                className={styles.dimmed}
                onClick={() => setDropdownOpen(false)} // 바깥 클릭 시 드롭다운 닫기
              />
            )}

            <div className={styles.selectBox2}>
              <button
                className={styles.label}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {dropdownValue}
                <span style={{ marginLeft: "8px" }}>
                  {dropdownOpen ? (
                    // 열려있을 때 위쪽 화살표
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="9"
                      viewBox="0 0 8 9"
                      fill="none"
                    >
                      <path
                        d="M4.35355 0.146447C4.15829 -0.0488155 3.84171 -0.0488156 3.64645 0.146447L0.464466 3.32843C0.269204 3.52369 0.269204 3.84027 0.464466 4.03553C0.659728 4.2308 0.976311 4.2308 1.17157 4.03553L4 1.20711L6.82843 4.03553C7.02369 4.2308 7.34027 4.2308 7.53553 4.03553C7.7308 3.84027 7.7308 3.52369 7.53553 3.32843L4.35355 0.146447ZM4 0.5L3.5 0.5L3.5 8.5L4 8.5L4.5 8.5L4.5 0.5L4 0.5Z"
                        fill="#FBFBFB"
                      />
                    </svg>
                  ) : (
                    // 닫혀있을 때 아래쪽 화살표
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="9"
                      viewBox="0 0 8 9"
                      fill="none"
                    >
                      <path
                        d="M3.64645 8.85355C3.84171 9.04882 4.15829 9.04882 4.35355 8.85355L7.53553 5.67157C7.7308 5.47631 7.7308 5.15973 7.53553 4.96447C7.34027 4.7692 7.02369 4.7692 6.82843 4.96447L4 7.79289L1.17157 4.96447C0.976311 4.7692 0.659728 4.7692 0.464466 4.96447C0.269204 5.15973 0.269204 5.47631 0.464466 5.67157L3.64645 8.85355ZM4 0.5L3.5 0.5L3.5 8.5L4 8.5L4.5 8.5L4.5 0.5L4 0.5Z"
                        fill="#FBFBFB"
                      />
                    </svg>
                  )}
                </span>
              </button>

              <ul
                className={styles.optionList}
                style={{ maxHeight: dropdownOpen ? "500px" : "0px" }}
              >
                {["공연 새로 만들기", "즐길거리 새로 만들기"].map(
                  (option, idx) => (
                    <li
                      key={idx}
                      className={styles.optionItem}
                      onClick={() => {
                        setDropdownValue(option);
                        setDropdownOpen(false);
                        if (option === "공연 새로 만들기") {
                          navigate("/show/create");
                        } else if (option === "즐길거리 새로 만들기") {
                          navigate("/entertain/create");
                        }
                      }}
                    >
                      {option}
                    </li>
                  )
                )}
              </ul>
            </div>
          </>
        )}
      </div>

      <div className={styles.showlist}>
        {filteredList.map((item, index) => (
          <ShowCard
            key={`${item.title}-${item.clubID}-${index}`}
            show={item}
            className={styles.showCard}
            onClick={() => {
              const { category, id } = item;
              if (category === "공연") navigate(`/show/${id}`);
              else if (
                category === "체험" ||
                category === "스트릿공연" ||
                category === "먹거리" ||
                category === "예배"
              )
                navigate(`/entertain/${id}`);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ShowList;
