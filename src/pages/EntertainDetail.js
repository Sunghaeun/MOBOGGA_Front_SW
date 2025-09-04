import React from "react";
import { useState, useEffect } from "react";
import { useCallback } from "react";
import styles from "./styles/Entertain.module.css";
import loadingStyles from "../styles/Loading.module.css";

import BACK from "../assets/ShowBackButton.svg";
import INSTA from "../assets/icons/instagram.svg";
import YOUTUBE from "../assets/icons/youtube.svg";
import KAKAO from "../assets/icons/kakao.svg";
import LINK from "../assets/icons/linkicons.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EntertainDetail() {
  const navigate = useNavigate(); // ⬅️ navigate 함수 받아오기

  const navigateToPrepage = () => {
    navigate(-1); // ⬅️ 뒤로가기
  };

  const { id } = useParams();
  const [entertainList, setEntertain] = useState(null);

  // API BASE & endpoint
  const API_BASE = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");
  const endpoint = `${API_BASE}/entertain/detail/${id}`;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEntertain = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await axios.get(endpoint);
      setEntertain(res.data);
    } catch (err) {
      // error loading entertain detail
      setError(err);
    } finally {
      setIsLoading(false); // 무조건 로딩 상태 변경
    }
  }, [endpoint]);

  // 처음 컴포넌트가 마운트될 때 fetchEntertain 호출
  useEffect(() => {
    fetchEntertain();
  }, [fetchEntertain]);

  const navigateToClubDetail = (clubId) => {
    navigate(`/clubs/${clubId}`);
  };

  // etcInfo 처리: 앞뒤 따옴표 제거, 줄바꿈 보존, URL을 하이퍼링크로 변환
  const renderEtcInfo = (raw) => {
    if (!raw) return "공지 정보 없음";

    let text = String(raw);

    // 앞뒤 작은따옴표/큰따옴표 제거
    if (
      (text.startsWith('"') && text.endsWith('"')) ||
      (text.startsWith("'") && text.endsWith("'"))
    ) {
      text = text.slice(1, -1);
    }

    text = text.trim();

    const urlRegex = /https?:\/\/[\w\-@:%._+~#=/?,&;()[\]$'!*+=]+/g;

    const lines = text.split(/\r?\n/);

    return lines.map((line, idx) => {
      const elements = [];
      let lastIndex = 0;
      let match;
      // reset lastIndex of regex
      urlRegex.lastIndex = 0;
      while ((match = urlRegex.exec(line)) !== null) {
        const url = match[0];
        const index = match.index;
        if (index > lastIndex) {
          elements.push(line.substring(lastIndex, index));
        }
        elements.push(
          <a
            key={`link-${idx}-${index}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#2b7cff" }}
          >
            {url}
          </a>
        );
        lastIndex = index + url.length;
      }
      if (lastIndex < line.length) {
        elements.push(line.substring(lastIndex));
      }

      return (
        <React.Fragment key={`line-${idx}`}>
          {elements}
          {idx !== lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  if (isLoading) {
    return (
      <div className={loadingStyles.loading}>
        <div className={loadingStyles.loadingSpinner}></div>
        <div className={loadingStyles.loadingText}>
          행사 정보를 불러오고 있습니다
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
          onClick={() => fetchEntertain()}
          className={loadingStyles.retryBtn}
        >
          다시 시도
        </button>
      </div>
    );
  }

  // const getAuth = async () => {
  //   try {
  //     const token = window.tempToken; // 임시 토큰 사용

  //     const response = await axios.get(`${API_BASE}/auth/me`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`, // 헤더에 토큰 추가
  //       },
  //       withCredentials: true,
  //     });

  //     setAuth(response.data);
  //   } catch (error) {
  //     // login failure handled by caller; debug output suppressed
  //     throw error;
  //   }
  // };

  return (
    <div className={styles.wrap}>
      <div className={styles.back_Div}>
        <button className={styles.back_Btn} onClick={navigateToPrepage}>
          <img src={BACK} className={styles.move_Back} alt="back" />
        </button>
      </div>
      <div className={styles.show_con}>
        <div className={styles.show_Intro}>
          <div className={styles.intro_Info}>
            <div className={styles.show_Top}>행사 정보</div>
            <div className={styles.intro_con}>
              <div className={styles.show_Left}>
                <img
                  src={
                    entertainList?.photo || "https://via.placeholder.com/150"
                  }
                  className={styles.show_Pic}
                  alt="show_IMG"
                />

                <div className={styles.sns_icons}>
                  {entertainList?.instaUrl && (
                    <a
                      href={entertainList.instaUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        className={styles.sns_icon}
                        src={INSTA}
                        alt="sns_icon"
                      />
                    </a>
                  )}
                  {entertainList?.youtubeUrl && (
                    <a
                      href={entertainList.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        className={styles.sns_icon}
                        src={YOUTUBE}
                        alt="sns_icon"
                      />
                    </a>
                  )}
                  {entertainList?.kakaoUrl && (
                    <a
                      href={entertainList.kakaoUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        className={styles.sns_icon}
                        src={KAKAO}
                        alt="sns_icon"
                      />
                    </a>
                  )}
                  {entertainList?.url && (
                    <a
                      href={entertainList.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        className={styles.sns_icon}
                        src={LINK}
                        alt="sns_icon"
                      />
                    </a>
                  )}
                </div>
              </div>

              <div className={styles.show_Info}>
                <div className={styles.title}>
                  {entertainList?.entertainName || "타이틀 정보 없음"}
                </div>
                <div
                  className={styles.club}
                  onClick={() => navigateToClubDetail(entertainList?.clubId)}
                >
                  {entertainList?.clubName
                    ? `${entertainList?.clubName} >`
                    : "동아리 정보 없음"}
                </div>

                <div className={styles.infos}>
                  <div className={styles.info_Box}>
                    <div className={styles.textBox}>
                      <span className={styles.fixed_Info1}>소개</span>
                    </div>

                    <span className={styles.variable_Info}>
                      {entertainList?.introductionLetter || "소개 정보 없음"}
                    </span>
                  </div>

                  <div className={styles.info_Box}>
                    <span className={styles.fixed_Info}>신청기한</span>
                    <span className={styles.variable_Info}>
                      {entertainList?.date || "신청기한 정보 없음"}
                    </span>
                  </div>
                  <div className={styles.info_Box}>
                    <span className={styles.fixed_Info}>일시</span>
                    <span className={styles.variable_Info}>
                      {entertainList?.timeList || "일시 정보 없음"}
                    </span>
                  </div>
                  <div className={styles.info_Box}>
                    <span className={styles.fixed_Info}>장소</span>
                    <span className={styles.variable_Info}>
                      {entertainList?.location || "장소 정보 없음"}
                    </span>
                  </div>
                  <div className={styles.info_Box}>
                    <span className={styles.fixed_Info}>문의</span>
                    <span className={styles.variable_Info}>
                      {entertainList?.managerPhoneNumber || "담당자 정보 없음"}{" "}
                      {entertainList?.manager ? "(" + entertainList.manager + ")" : ""}
                    </span>
                  </div>

                  <div className={styles.info_Box}>
                    <div className={styles.textBox}>
                      <span className={styles.fixed_Info1}>기타정보</span>
                    </div>
                    <div className={styles.inner}>
                      <span className={styles.variable_Info}>
                        {renderEtcInfo(entertainList?.etcInfo)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EntertainDetail;
