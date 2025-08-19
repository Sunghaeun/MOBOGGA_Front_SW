/* eslint-disable */
import React from "react";
import { useState, useEffect } from "react";
import styles from "./styles/Entertain.module.css";

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

  useEffect(() => {
    const fetchEntertain = async () => {
      try {
        const res = await axios.get(endpoint);
        console.log(res.data);
        setEntertain(res.data);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      }
    };

    fetchEntertain();
  }, [endpoint]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const res = await axios.get(endpoint);
        console.log(res.data);
        setEntertain(res.data);
        setLoading(false);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setLoading(false);
      }
    };

    fetchShow();
  }, [endpoint]);

  const navigateToClubDetail = (clubId) => {
    navigate(`/clubs/${clubId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const getAuth = async () => {
    try {
      const token = window.tempToken; // 임시 토큰 사용

      const response = await axios.get(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`, // 헤더에 토큰 추가
        },
        withCredentials: true,
      });

      console.log("Response from backend:", response.data);

      setAuth(response.data);
    } catch (error) {
      console.error("Login failed with error: ", error);
      throw error;
    }
  };

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
                      <span className={styles.fixed_Info1}>소개글</span>
                    </div>

                    <span className={styles.variable_Info}>
                      {entertainList?.introductionLetter || "소개글 정보 없음"}
                    </span>
                  </div>

                  <div className={styles.info_Box}>
                    <span className={styles.fixed_Info}>카테고리</span>
                    <span className={styles.variable_Info}>
                      {entertainList?.category || "카테고리 정보 없음"}
                    </span>
                  </div>
                  <div className={styles.info_Box}>
                    <span className={styles.fixed_Info}>장소</span>
                    <span className={styles.variable_Info}>
                      {entertainList?.location || "장소 정보 없음"}
                    </span>
                  </div>
                  <div className={styles.info_Box}>
                    <span className={styles.fixed_Info}>날짜</span>
                    <span className={styles.variable_Info}>
                      {entertainList?.date || "날짜 정보 없음"}
                    </span>
                  </div>
                  <div className={styles.info_Box}>
                    <span className={styles.fixed_Info}>시간</span>
                    <span className={styles.variable_Info}>
                      {entertainList?.timeList || "시간 정보 없음"}
                    </span>
                  </div>
                  <div className={styles.info_Box}>
                    <span className={styles.fixed_Info}>담당자</span>
                    <span className={styles.variable_Info}>
                      {entertainList?.managerPhoneNumber || "담당자 정보 없음"}{" "}
                      {" ("}
                      {entertainList?.manager || " "}
                      {") "}
                    </span>
                  </div>

                  <div className={styles.info_Box}>
                    <div className={styles.textBox}>
                      <span className={styles.fixed_Info1}>기타정보</span>
                    </div>
                    <div className={styles.inner}>
                      <span className={styles.variable_Info}>
                        {entertainList?.etcInfo || "공지 정보 없음"}
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
