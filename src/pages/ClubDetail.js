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
        `${process.env.REACT_APP_API_URL}/club/detail/1`
      );

      setClub(res.data);

      const list1 =
        res.data.progressingEventList?.map((item) => {
          return {
            categoryOfEvent: item.categoryOfEvent,
            id: item.id,
            poster: item.poster,
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
            poster: item.poster,
          };
        }) || [];

      const list3 =
        res.data.lastRecruitingList?.map((item) => {
          return {
            recruitingId: item.recruitingId,
            period: item.period,
            poster: item.poster,
          };
        }) || [];

      // 상태 저장
      setProgressingEventList(list1);
      setLastEventList(list2);
      setLastRecruitingList(list3);
    } catch (err) {
      // error handled by state
      setError("동아리 정보를 불러오는데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
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
          다시 시도
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
            <img
              src={clubList.photo}
              alt="동아리 사진"
              className={styles.ClubImg}
            />

            <div className={styles.clubDeatilText1}>
              <div className={styles.clubDeatiltitleDiv}>
                <span className={styles.clubDeatiltitle}>필수학기</span>
              </div>
              <div className={styles.clubDeatiltextDiv}>
                <span className={styles.clubDeatiltext}>
                  {clubList.mandatorySemesters}학기
                </span>
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
            <span className={styles.content}>
              {clubList.content?.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < clubList.content.split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </span>
          </div>
        </div>

        <span className={styles.titleName}> 진행 중인 이벤트 </span>
        <div className={styles.EventCardContainer}>
          {progressingEventList.length > 0 ? (
            progressingEventList.map((item, index) => (
              <EventCard
                key={index}
                show={item}
                onClick={() => {
                  const category = item.categoryOfEvent;
                  const id = item.id;

                  if (category === "공연") {
                    navigate(`/show/${id}`);
                  } else if (category === "행사") {
                    navigate(`/entertain/${id}`);
                  } else if (category === "리크루팅") {
                    navigate(`/recruiting/${id}`);
                  }
                }}
              />
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#666",
                fontSize: "16px",
              }}
            >
              해당 내역이 없습니다.
            </div>
          )}
        </div>

        <span className={styles.titleName}> 지난 리크루팅 </span>
        <div className={styles.LastRecruitingCardContainer}>
          {lastRecruitingList.length > 0 ? (
            lastRecruitingList.map((item, index) => (
              <LastRecruitingCard
                key={index}
                show={item}
                onClick={() => navigate(`/recruiting/${item.recruitingId}`)}
              />
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#666",
                fontSize: "16px",
              }}
            >
              해당 내역이 없습니다.
            </div>
          )}
        </div>

        <span className={styles.titleName}> 지난 공연 & 행사 </span>
        <div className={styles.LastRecruitingCardContainer}>
          {lastEventList.length > 0 ? (
            lastEventList.map((item, index) => (
              <LastEventCard
                key={index}
                show={item}
                onClick={() => {
                  const category = item.showOrEntertain;
                  const id = item.id;

                  if (category === "공연") {
                    navigate(`/show/${id}`);
                  } else {
                    navigate(`/entertain/${id}`);
                  }
                }}
              />
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#666",
                fontSize: "16px",
              }}
            >
              해당 내역이 없습니다.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ClubDetail;
