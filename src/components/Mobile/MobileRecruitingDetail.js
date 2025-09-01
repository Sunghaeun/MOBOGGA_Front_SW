import React from "react";
import styles from "./styles/MobileRecruitingDetail.module.css";
import PageHeader from "../Mobile/PageHeader";
import insta from "../../assets/icons/i.svg";
import youtube from "../../assets/icons/y.svg";
import kakao from "../../assets/icons/k.svg";

import { useNavigate } from "react-router-dom";

function MobileRecruitingDetail({ recruiting = {} }) {
  const navigate = useNavigate();
  const navigateToClubDetail = (clubId) => {
    navigate(`/clubs/${clubId}`); // 동아리 상세 페이지로 이동
  };

  const handleApply = () => {
    if (recruiting.applicationUrl) {
      window.open(recruiting.applicationUrl, "_blank");
    } else {
      alert("지원 링크가 없습니다.");
    }
  };

  return (
    <>
      <div className={styles.recruitingDetail}>
        <PageHeader title="리쿠르팅 정보" />
        <div className={styles.recruitingTopContainer}>
          <div
            className={styles.backgroundImg}
            style={{ backgroundImage: `url(${recruiting.poster})` }}
            aria-hidden="true"
          ></div>
          <div className={styles.sns_icons}>
            {recruiting && (
              <a href={recruiting.instaUrl}>
                <img
                  className={styles.sns_icon}
                  src={insta}
                  alt="sns_icon"
                ></img>
              </a>
            )}
            {recruiting && (
              <a href={recruiting.youtubeUrl}>
                <img
                  className={styles.sns_icon}
                  src={youtube}
                  alt="sns_icon"
                ></img>
              </a>
            )}
            {recruiting && (
              <a href={recruiting.kakaoUrl}>
                <img
                  className={styles.sns_icon}
                  src={kakao}
                  alt="sns_icon"
                ></img>
              </a>
            )}
          </div>
          <img
            src={recruiting.poster}
            className={styles.recruite_Pic}
            alt="recruite_IMG"
          />
          <div
            className={styles.club}
            onClick={() => navigateToClubDetail(recruiting?.clubId)}
          >
            {recruiting?.clubName
              ? `${recruiting?.clubName} >`
              : "동아리 정보 없음"}
          </div>
        </div>

        <div className={styles.title}>
          {recruiting?.recruitingTitle || "타이틀 정보 없음"}
        </div>

        <div className={styles.recruitingDetailContent}>
          <div className={styles.clubDetailTexts}>
            <span className={styles.clubDetailText}>
              {recruiting.introductionLetter
                ? recruiting.introductionLetter
                    .split("\n")
                    .map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))
                : "소개 정보 없음"}
            </span>
          </div>

          <span className={styles.contentTitle}>카테고리</span>
          <span className={styles.contentText}>
            {recruiting?.category || "카테고리 정보 없음"}
          </span>

          <span className={styles.contentTitle}>모집기간</span>
          <span className={styles.contentText}>
            {recruiting?.dates || "날짜 정보 없음"}
          </span>

          <span className={styles.contentTitle}>필수학기</span>
          <span className={styles.contentText}>
            {recruiting?.mandatorySemesters
              ? `${recruiting?.mandatorySemesters}학기`
              : "필수학기 정보 없음"}
          </span>

          <span className={styles.contentTitle}>정모시간</span>
          <span className={styles.contentText}>
            {recruiting?.meetingTime || "정모시간 정보 없음"}
          </span>

          <span className={styles.contentTitle}>활동내용</span>
          <span className={styles.contentText}>
            {recruiting?.content
              ? recruiting.content.split("\n\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))
              : "활동내용 정보 없음"}
          </span>

          <span className={styles.contentTitle}>지원자격</span>
          <span className={styles.contentText}>
            {recruiting?.eligibility
              ? recruiting.eligibility.split("\n\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))
              : "지원자격 정보 없음"}
          </span>

          <span className={styles.contentTitle}>면접안내</span>
          <span className={styles.contentText}>
            {recruiting?.notice
              ? recruiting.notice.split("\n\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))
              : "면접안내 정보 없음"}
          </span>

          <span className={styles.contentTitle}>문의</span>
          <span className={styles.contentText}>
            {recruiting?.managerInfo || "문의 정보 없음"}
          </span>
        </div>

        <div className={styles.applyButtonContainer}>
          <button className={styles.apply_Btn} onClick={handleApply}>
            지원하러가기
          </button>
        </div>
      </div>
    </>
  );
}

export default MobileRecruitingDetail;
