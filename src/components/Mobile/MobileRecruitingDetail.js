import React from "react";
import styles from "./styles/MobileRecruitingDetail.module.css";
import loadingStyles from "../../styles/Loading.module.css";
import PageHeader from "../Mobile/PageHeader";
import insta from "../../assets/icons/i.svg";
import youtube from "../../assets/icons/y.svg";
import kakao from "../../assets/icons/k.svg";

import { useNavigate } from "react-router-dom";

// 텍스트 내 줄바꿈과 링크를 모두 처리하는 함수
function renderWithLinksAndLineBreaks(text) {
  if (!text) return "";
  const urlRegex = /https?:\/\/[\w\-@:%._+~#=/?,&;()[\]$'!*+=]+/g;
  const lines = String(text).split(/\r?\n/);
  return lines.map((line, idx) => {
    const parts = [];
    let lastIndex = 0;
    let match;
    urlRegex.lastIndex = 0;
    while ((match = urlRegex.exec(line)) !== null) {
      const url = match[0];
      const index = match.index;
      if (index > lastIndex) {
        parts.push(line.substring(lastIndex, index));
      }
      parts.push(
        <a
          key={`link-${idx}-${index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#2b7cff", wordBreak: "break-all" }}
        >
          {url}
        </a>
      );
      lastIndex = index + url.length;
    }
    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }
    return (
      <React.Fragment key={`line-${idx}`}>
        {parts}
        {idx !== lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

function MobileRecruitingDetail({
  recruiting = {},
  isLoading,
  error,
  onRetry,
}) {
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
        {onRetry && (
          <button onClick={onRetry} className={loadingStyles.retryBtn}>
            다시 시도
          </button>
        )}
      </div>
    );
  }

  return (
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
              <img className={styles.sns_icon} src={insta} alt="sns_icon"></img>
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
              <img className={styles.sns_icon} src={kakao} alt="sns_icon"></img>
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
            {renderWithLinksAndLineBreaks(
              recruiting.introductionLetter || "소개 정보 없음"
            )}
          </span>
        </div>

        <span className={styles.contentTitle}>카테고리</span>
        <span className={styles.contentText}>
          {renderWithLinksAndLineBreaks(
            recruiting?.category || "카테고리 정보 없음"
          )}
        </span>

        <span className={styles.contentTitle}>모집기간</span>
        <span className={styles.contentText}>
          {renderWithLinksAndLineBreaks(recruiting?.dates || "날짜 정보 없음")}
        </span>

        <span className={styles.contentTitle}>필수학기</span>
        <span className={styles.contentText}>
          {renderWithLinksAndLineBreaks(
            recruiting?.mandatorySemesters
              ? `${recruiting?.mandatorySemesters}학기`
              : "필수학기 정보 없음"
          )}
        </span>

        <span className={styles.contentTitle}>정모시간</span>
        <span className={styles.contentText}>
          {renderWithLinksAndLineBreaks(
            recruiting?.meetingTime || "정모시간 정보 없음"
          )}
        </span>

        <span className={styles.contentTitle}>활동내용</span>
        <span className={styles.contentText}>
          {renderWithLinksAndLineBreaks(
            recruiting?.content || "활동내용 정보 없음"
          )}
        </span>

        <span className={styles.contentTitle}>지원자격</span>
        <span className={styles.contentText}>
          {renderWithLinksAndLineBreaks(
            recruiting?.eligibility || "지원자격 정보 없음"
          )}
        </span>

        <span className={styles.contentTitle}>면접안내</span>
        <span className={styles.contentText}>
          {renderWithLinksAndLineBreaks(
            recruiting?.notice || "면접안내 정보 없음"
          )}
        </span>

        <span className={styles.contentTitle}>문의</span>
        <span className={styles.contentText}>
          {renderWithLinksAndLineBreaks(
            recruiting?.managerInfo || "문의 정보 없음"
          )}
        </span>
      </div>

      <div className={styles.applyButtonContainer}>
        <button className={styles.apply_Btn} onClick={handleApply}>
          지원하러가기
        </button>
      </div>
    </div>
  );
}

export default MobileRecruitingDetail;
