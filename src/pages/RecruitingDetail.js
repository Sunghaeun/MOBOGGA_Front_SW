/* eslint-disable */
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import styles from "./styles/RecruitingDetail.module.css";
import loadingStyles from "../styles/Loading.module.css";

import BACK from "../assets/ShowBackButton.svg";
import INSTA from "../assets/recruitingDetail/instagram.svg";
import YOUTUBE from "../assets/recruitingDetail/youtube.svg";
import KAKAO from "../assets/recruitingDetail/kakao.svg";
import axios from "axios";

function RecruitingDetail() {
  const { recruitingId } = useParams();

  const [recruiting, setRecruiting] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const navigateToPrepage = () => {
    navigate(-1); // 이전 페이지로 이동
  };
  const navigateToApplypage = () => {
    window.open(recruiting.applicationUrl);
  };
  const navigateToClubDetail = (clubId) => {
    navigate(`/clubs/${clubId}`); // 동아리 상세 페이지로 이동
  };

  const recruite = {
    clubName: "MIC",
    recruitingId: 1,
    recruitingTitle: "MIC 31ST 남자 추가 리쿠르팅",
    photo:
      "https://postfiles.pstatic.net/MjAyMTA4MjFfMjU0/MDAxNjI5NTU3MTUwNDk0.NxjYFKCSiQyGqThwfLaKT8kTPABtS6U3K0Db4utl4LEg.oxYqflMZpVpQKxvwD-JpBaUGNQcs6y-GRWDbfbWVL3kg.JPEG.chooddingg/PHOTO_0092.JPG?type=w773",
    startDate: "2025.03.23(일)",
    endDate: "03.26(수)",
    mandatorySemesters: 4,
    field: "string",
    eligibility:
      "️✔️춤 추는 것을 좋아하고 관심이 있는 분\n✔️춤을 통해 하나님께 영광 올려드리는 '문화 사역'에 관심 있으신 분\n✔️한번도 춤을 춰보지 않았지만 차근차근 배워볼 용기와 끈기를 가지신 분\n❗단, 학번 상관 없이 필수 학기인 '연속 4학기 활동'이 가능하신 분!!\n️❗면접 날짜에 참여가 가능하신 분",
    interviewDate: "3월 27일(목) 오후 7~8시",
    location: "지하 연습실 (학관 퇴식구쪽)",
    notice: "🔑간단한 춤 루틴 티칭 및 평가&심층 구술 면접",
    managerInfo: "최새싹 010-9876-5432",
    applicationUrl: "string",
    content:
      "안녕하세요 25학번 세워가는 세대 '뚝딱이' 여러분들! 한동대 학우 여러분! 춤으로 하나님께 영광 올려드리는 사역 단체이자 힙합 기반의 춤 동아리 MIC입니다!🕺 2025년 신입기수로 저희와 함께할 MIC31기를 모집합니다! \n\n*새내기가 아닌 타 학번 또한 지원 가능합니다!\n*모든 면접은 오프라인으로 진행되며 자세한 사항은 인스타 혹은 카카오 채팅을 통해 문의 바랍니다.",
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/recruiting/detail/${recruitingId}`
      );
      console.log("API 응답 데이터:", response.data);
      if (response.data) {
        setRecruiting(response.data);
        console.log("API 전체", response.data);
      } else {
        console.error("API에 recruiting 데이터가 없습니다.");
        setRecruiting(null);
        setError("리크루팅 정보를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("Fetch Error:");
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      setRecruiting(null);
      setError("리크루팅 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className={loadingStyles.loading}>
        <div className={loadingStyles.loadingSpinner}></div>
        <div className={loadingStyles.loadingText}>
          리크루팅 정보를 불러오고 있습니다
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
        <button onClick={() => fetchData()} className={loadingStyles.retryBtn}>
          🔄 다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.back_Div}>
        <button className={styles.back_Btn} onClick={navigateToPrepage}>
          <img src={BACK} className={styles.move_Back} alt="back" />
        </button>
      </div>
      <div className={styles.recruite_con}>
        <div className={styles.recruite_Intro}>
          <div className={styles.intro_Info}>
            <div className={styles.recruite_Top}>리크루팅 정보</div>
            <div className={styles.intro_con}>
              <div className={styles.intro_con_left}>
                {recruiting && (
                  <img
                    src={recruiting.poster}
                    className={styles.recruite_Pic}
                    alt="recruite_IMG"
                  />
                )}
                <div className={styles.sns_icons}>
                  {recruiting && (
                    <a href={recruiting.instaUrl}>
                      <img
                        className={styles.sns_icon}
                        src={INSTA}
                        alt="sns_icon"
                      ></img>
                    </a>
                  )}
                  {recruiting && (
                    <a href={recruiting.youtubeUrl}>
                      <img
                        className={styles.sns_icon}
                        src={YOUTUBE}
                        alt="sns_icon"
                      ></img>
                    </a>
                  )}
                  {recruiting && (
                    <a href={recruiting.kakaoUrl}>
                      <img
                        className={styles.sns_icon}
                        src={KAKAO}
                        alt="sns_icon"
                      ></img>
                    </a>
                  )}
                </div>
                <div className={styles.recruite_left_cont}>
                  {
                    <span className={styles.clubDetailText}>
                      {/* {recruiting.eligibility.split("\n").map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))} */}
                      {recruiting.content}
                    </span>
                  }
                </div>
              </div>

              <div className={styles.recruite_Info}>
                <div
                  className={styles.club}
                  onClick={() => navigateToClubDetail(recruiting?.clubId)}
                >
                  {recruiting?.clubName || "동아리 정보 없음"}
                </div>
                <div className={styles.title}>
                  {recruiting?.recruitingTitle || "타이틀 정보 없음"}
                </div>
                <div className={styles.infos}>
                  <div className={styles.info_Box}>
                    <span className={styles.fixed_Info}>모집기간</span>
                    <span className={styles.variable_Info}>
                      {recruiting?.dates || "날짜 정보 없음"}
                    </span>
                  </div>
                  <div className={styles.info_Box}>
                    <span className={styles.fixed_Info}>필수학기</span>
                    <span className={styles.variable_Info}>
                      {recruiting?.mandatorySemesters
                        ? `${recruiting?.mandatorySemesters}학기`
                        : "필수학기 정보 없음"}
                    </span>
                  </div>
                  <div className={styles.info_Box}>
                    <span className={styles.fixed_Info}>정모시간</span>
                    <span className={styles.variable_Info}>{"없음"}</span>
                  </div>
                  <div className={styles.info_Box}>
                    <span className={styles.fixed_Info}>면접날짜</span>
                    <span className={styles.variable_Info}>
                      {recruiting?.interviewDate || "인터뷰 날짜 정보 없음"}
                    </span>
                  </div>
                  <div className={styles.info_Box}>
                    <span className={styles.fixed_Info}>면접안내</span>
                    <span className={styles.variable_Info}>
                      {recruiting?.notice || "안내 정보 없음"}
                    </span>
                  </div>
                  <div className={styles.info_Box}>
                    <span className={styles.fixed_Info}>문의</span>
                    <span className={styles.variable_Info}>
                      {recruiting?.managerInfo || "문의 정보 없음"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.recruite_apply}>
              <button
                className={styles.apply_Btn}
                onClick={navigateToApplypage}
              >
                지원하러 가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruitingDetail;
