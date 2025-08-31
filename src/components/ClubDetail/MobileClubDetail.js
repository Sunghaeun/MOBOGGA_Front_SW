import React from "react";
import styles from "./MobileClubDetail.module.css";
import PageHeader from "../Mobile/PageHeader";
import insta from "../../assets/icons/instagram.svg";
import youtube from "../../assets/icons/youtube.svg";
import kakao from "../../assets/icons/kakao.svg";
import link from "../../assets/icons/linkicons.svg";

import EventCard from "./EventCard";
import LastRecruitingCard from "./LastRecruitingCard";
import LastEventCard from "./LastEventCard";
import { useNavigate } from "react-router-dom";


function MobileClubDetail({ clubList = {},
  progressingEventList = [],
  lastRecruitingList = [],
  lastEventList = [], }) {

  const navigate = useNavigate();

  return (
    <>
      <div className={styles.clubDetail}>
        <PageHeader title="동아리 정보" />

        <img
          src={clubList.photo}
          alt="동아리 사진"
          className={styles.ClubImg}
        />

        <div className={styles.clubDetailContent}>
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
              
              <div className={styles.detailContent}>
                <span className={styles.content}>
                  {clubList.content?.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < clubList.content.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </span>
                <span className={styles.clubDetailtitle}>필수학기</span>
                <span className={styles.clubDetailtext}>
                  {clubList.mandatorySemesters}학기
                </span>
              </div>
            
        </div>

        <div className={styles.titleNameDesign}>
          <span className={styles.titleName}> 진행 중인 행사 </span>
        </div>

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

          <div className={styles.titleNameDesign}>
            <span className={styles.titleName}> 지난 리크루팅 </span>
          </div>

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

      
        <div className={styles.titleNameDesign}>
          <span className={styles.titleName}> 지난 공연 & 행사 </span>
        </div>
          
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

export default MobileClubDetail;