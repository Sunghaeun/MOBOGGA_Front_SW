/* eslint-disable */
import React from "react";
import { useState, useEffect } from "react";
import styles from "./styles/Entertain.module.css";

import BACK from "../assets/ShowBackButton.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EntertainDetail() {
  const navigate = useNavigate(); // ⬅️ navigate 함수 받아오기

  const navigateToPrepage = () => {
    navigate(-1); // ⬅️ 뒤로가기
  };

  const { id } = useParams();
  const [entertainList, setShow] = useState(null);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/entertain/detail/${id}`
        );

        console.log(res.data);

        setShow(res.data);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      }
    };

    fetchShow();
  }, [id]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/entertain/detail/${id}`
        );

        console.log(res.data);

        setShow(res.data);
        setLoading(false);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setLoading(false);
      }
    };

    fetchShow();
  }, [id]);

  const navigateToClubDetail = (clubId) => {
    navigate(`/clubs/${clubId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const getAuth = async () => {
    try {
      const token = localStorage.getItem("jwt"); // 저장된 토큰 불러오기

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 헤더에 토큰 추가
          },
          withCredentials: true,
        }
      );

      console.log("Response from backend:", response.data);

      setAuth(response.data);
    } catch (error) {
      console.error("Login failed with error: ", error);
      throw error;
    }
  };

  // const entertainList =
  //   {
  //     entertainId: 1,
  //     entertainName: "MIC WORKSHOP",
  //     clubName: "MIC",
  //     photo: "https://your-image-url.com/mic-workshop.jpg", // 실제 이미지 주소로 교체하세요
  //     introductionLetter: "MIC에서 워크샵을 진행합니다.\nMIC 워크샵이란? 다양한 동작들을 배워 춤을 직접 춰보는 시간입니다. 또한, 무료로 춤 수업을 받으실 수 있습니다!",
  //     category: "체험",
  //     location: "학관 지하 대형 연습실",
  //     date: "2025.03.11 - 2025.03.13",
  //     timeList: "3월 11일(화) 19:00-20:30, 3월 13일(목) 19:00-20:30",
  //     etcInfo: `<1차>
  // 일시: 3월 11일 화요일(주차: 화요일)
  // 시간: 19:00-20:30
  // 장소: 학관 지하 대형 연습실
  // 신청마감: 3/10(월) 자정
  // 🎵1차 노래: Trip - Ella Mai

  // <2차>
  // 일시: 3월 13일 목요일(주차: 목요일)
  // 시간: 19:00-20:30
  // 장소: 학관 지하 대형 연습실
  // 🎵2차 노래: Light Show - Matt Corman

  // 인스타 프로필 하단 링크트리에서도 확인하실 수 있습니다!`,
  //     instaUrl: "https://www.instagram.com/", // 실제 인스타 URL로 교체
  //     url: "https://your-linktree-url.com"    // 실제 링크트리나 기타 URL로 교체
  //   }
  // ;

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
            <div className={styles.show_Top}>즐길거리 정보</div>
            <div className={styles.intro_con}>
              <img
                src={entertainList?.photo || "https://via.placeholder.com/150"}
                className={styles.show_Pic}
                alt="show_IMG"
              />

              <div className={styles.show_Info}>
                <div className={styles.title}>
                  {entertainList?.entertainName || "타이틀 정보 없음"}
                </div>
                <div
                  className={styles.club}
                  //onClick={() => navigate(`/clubs/${entertainList?.clubId}`)}
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
                      {entertainList?.managerInfo || "담당자 정보 없음"}
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
