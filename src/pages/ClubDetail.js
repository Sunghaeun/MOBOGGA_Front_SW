/* eslint-disable */
import React, { useState, useEffect } from "react";
import styles from "./styles/ClubDetail.module.css";
import loadingStyles from "../styles/Loading.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import insta from "../assets/icons/instagram.svg";
import youtube from "../assets/icons/youtube.svg";
import kakao from "../assets/icons/kakao.svg";
import link from "../assets/icons/linkicons.svg";

import EventCard from "../components/ClubDetail/EventCard";
import LastRecruitingCard from "../components/ClubDetail/LastRecruitingCard";
import LastEventCard from "../components/ClubDetail/LastEventCard";

function ClubDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // 경로에서 :id 부분 가져옴

  // 1) club 정보 데이터 가져오기
  const [clubList, setClub] = useState([]);
  const [progressingEventList, setProgressingEventList] = useState([]);
  const [lastRecruitingList, setLastRecruitingList] = useState([]);
  const [lastEventList, setLastEventList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getClub = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/club/detail/${id}`
      );

      console.log("club 데이터 가져오기 성공");
      console.log(res.data);
      setClub(res.data);

      const list1 =
        res.data.progressingEventList?.map((item) => {
          return {
            categoryOfEvent: item.categoryOfEvent,
            id: item.id,
            photo: item.photo,
            startDate: item.startDate,
            endDate: item.endDate,
            title: item.title,
          };
        }) || [];

      const list2 =
        res.data.lastEventList?.map((item) => {
          return {
            id: item.id,
            showOrEntertain: item.showOrEntertain,
            title: item.title,
            startDate: item.startDate,
            endDate: item.endDate,
            photo: item.photo,
          };
        }) || [];

      const list3 =
        res.data.lastRecruitingList?.map((item) => {
          return {
            recruitingId: item.recruitingId,
            period: item.period,
            photo: item.photo,
          };
        }) || [];

      // 상태 저장
      setProgressingEventList(list1);
      setLastEventList(list2);
      setLastRecruitingList(list3);

      console.log("진행 중인 이벤트:", list1);
      console.log("지난 볼거리:", list2);
      console.log("지난 리크루팅:", list3);
    } catch (err) {
      console.error(err);
    }
  };
  // 2) 페이지 로드되면 club 정보값 불러옴

  useEffect(() => {
    getClub();
  }, []);

  if (isLoading) {
    return (
      <div className={loadingStyles.loading}>
        <div className={loadingStyles.loadingSpinner}></div>
        <div className={loadingStyles.loadingText}>
          동아리 정보를 불러오고 있습니다
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
      <div className={styles.clubDetail}>
        <span className={styles.titleName}> 동아리 정보 </span>
        <div className={styles.clubDeatilContainer}>
          <div className={styles.clubDeatilLeft}>
            <img src={clubList.photo} alt="" className={styles.ClubImg} />

            <div className={styles.clubDeatilText1}>
              <div className={styles.clubDeatiltitleDiv}>
                <span className={styles.clubDeatiltitle}>필수학기</span>
              </div>
              <div className={styles.clubDeatiltextDiv}>
                <span className={styles.clubDeatiltext}>
                  {clubList.mandatorySemesters}
                </span>
              </div>
            </div>

            <div className={styles.clubDeatilText1}>
              <div className={styles.clubDeatiltitleDiv}>
                <span className={styles.clubDeatiltitle}>활동일정</span>
              </div>
              <div className={styles.clubDeatiltextDiv}>
                {/* <span className={styles.clubDeatiltext}>
                  {clubList.activitySchedule.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </span> */}
              </div>
            </div>
          </div>

          <div className={styles.clubDeatilRight}>
            <span className={styles.clubName}>{clubList.clubName}</span>

            <div className={styles.icons}>
              <a href={clubList.instaUrl}>
                <img src={insta} alt="" className={styles.iconImg} />
              </a>
              <a href={clubList.youtubeUrl}>
                <img src={youtube} alt="" className={styles.iconImg} />
              </a>
              <a href={clubList.kakaoUrl}>
                <img src={kakao} alt="" className={styles.iconImg} />
              </a>
              <a href={clubList.kakaoUrl}>
                <img src={link} alt="" className={styles.iconImg} />
              </a>
            </div>
            <span className={styles.content}>{clubList.content}</span>
          </div>
        </div>

        <span className={styles.titleName}> 진행 중인 이벤트 </span>
        <div className={styles.EventCardContainer}>
          {progressingEventList.map((item, index) => (
            <EventCard
              key={index}
              show={item}
              onClick={() => {
                const category = item.categoryOfEvent;
                const id = item.id;

                if (category === "공연") {
                  navigate(`/show/${id}`);
                } else if (category === "즐길거리") {
                  navigate(`/entertain/${id}`);
                }
              }}
            />
          ))}
        </div>

        <span className={styles.titleName}> 지난 리크루팅 </span>
        <div className={styles.LastRecruitingCardContainer}>
          {lastRecruitingList.map((item, index) => (
            <LastRecruitingCard
              key={index}
              show={item}
              onClick={() => navigate(`/recruiting/${item.recruitingId}`)}
            />
          ))}
        </div>

        <span className={styles.titleName}> 지난 볼거리 </span>
        <div className={styles.LastRecruitingCardContainer}>
          {lastEventList.map((item, index) => (
            <LastEventCard
              key={index}
              show={item}
              onClick={() => {
                const category = item.showOrEntertain;
                const id = item.id;

                if (category === "공연") {
                  navigate(`/show/${id}`);
                } else if (category === "즐길거리") {
                  navigate(`/entertain/${id}`);
                }
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default ClubDetail;
