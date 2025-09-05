import React from "react";
import { useState, useEffect } from "react";
import { useCallback } from "react";
import styles from "./EntertainDetailMobile.module.css";
import loadingStyles from "../../styles/Loading.module.css";

import BACK from "../../assets/ShowBackButton.svg";
import { ReactComponent as INSTA } from "../../assets/icons/instagram.svg";
import { ReactComponent as YOUTUBE } from "../../assets/icons/youtube.svg";
import { ReactComponent as KAKAO } from "../../assets/icons/kakao.svg";
import { ReactComponent as LINK } from "../../assets/icons/linkicons.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EntertainDetailMobile() {
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

  return (
    <div className={styles.wrap}>
      <div className={styles.show_con}>
        <div className={styles.show_Intro}>
          <div className={styles.intro_Info}>
            <div className={styles.show_Top}>
              <span className={styles.back_Div}>
                <button className={styles.back_Btn} onClick={navigateToPrepage}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="20"
                    viewBox="0 0 12 20"
                    fill="none"
                  >
                    <path
                      d="M9.18206 19.6042L0.290237 10.7388C0.184697 10.6332 0.110114 10.5189 0.0664908 10.3958C0.0221636 10.2726 0 10.1407 0 10C0 9.85928 0.0221636 9.72735 0.0664908 9.60422C0.110114 9.48109 0.184697 9.36675 0.290237 9.26121L9.18206 0.369393C9.42832 0.123131 9.73615 0 10.1055 0C10.4749 0 10.7916 0.131926 11.0554 0.395778C11.3193 0.659631 11.4512 0.967458 11.4512 1.31926C11.4512 1.67106 11.3193 1.97889 11.0554 2.24274L3.29815 10L11.0554 17.7573C11.3017 18.0035 11.4248 18.3068 11.4248 18.667C11.4248 19.028 11.2929 19.3404 11.029 19.6042C10.7652 19.8681 10.4573 20 10.1055 20C9.75374 20 9.44591 19.8681 9.18206 19.6042Z"
                      fill="#121212"
                    />
                  </svg>{" "}
                </button>
              </span>
              행사 정보
            </div>
            <div className={styles.intro_con}>
              <div className={styles.picDiv}>
                <img
                  src={entertainList?.photo}
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        fill="none"
                      >
                        <g filter="url(#filter0_d_6235_26983)">
                          <path
                            d="M18 8.16276C21.206 8.16276 21.5824 8.17705 22.8496 8.23422C24.0215 8.28662 24.655 8.48194 25.079 8.64867C25.6411 8.8678 26.0413 9.12505 26.4605 9.54426C26.8797 9.96348 27.1417 10.3636 27.3561 10.9258C27.5181 11.3497 27.7182 11.9833 27.7706 13.1552C27.8277 14.4224 27.842 14.7987 27.842 18.0048C27.842 21.2108 27.8277 21.5871 27.7706 22.8543C27.7182 24.0262 27.5228 24.6598 27.3561 25.0838C27.137 25.6459 26.8797 26.0461 26.4605 26.4653C26.0413 26.8845 25.6411 27.1465 25.079 27.3609C24.655 27.5228 24.0215 27.7229 22.8496 27.7753C21.5824 27.8325 21.206 27.8468 18 27.8468C14.794 27.8468 14.4176 27.8325 13.1505 27.7753C11.9786 27.7229 11.345 27.5276 10.921 27.3609C10.3589 27.1417 9.95872 26.8845 9.5395 26.4653C9.12029 26.0461 8.85828 25.6459 8.64391 25.0838C8.48194 24.6598 8.28186 24.0262 8.22946 22.8543C8.17229 21.5871 8.158 21.2108 8.158 18.0048C8.158 14.7987 8.17229 14.4224 8.22946 13.1552C8.28186 11.9833 8.47718 11.3497 8.64391 10.9258C8.86304 10.3636 9.12029 9.96348 9.5395 9.54426C9.95872 9.12505 10.3589 8.86304 10.921 8.64867C11.345 8.4867 11.9786 8.28662 13.1505 8.23422C14.4176 8.17229 14.7987 8.16276 18 8.16276ZM18 6C14.7416 6 14.3319 6.01429 13.0504 6.07146C11.7737 6.12862 10.9019 6.33347 10.1397 6.62882C9.34895 6.9337 8.68202 7.34815 8.01509 8.01509C7.34816 8.68202 6.93847 9.35371 6.62882 10.1397C6.33347 10.9019 6.12862 11.7737 6.07146 13.0552C6.01429 14.3319 6 14.7416 6 18C6 21.2584 6.01429 21.6681 6.07146 22.9496C6.12862 24.2263 6.33347 25.0981 6.62882 25.865C6.9337 26.6558 7.34816 27.3227 8.01509 27.9897C8.68202 28.6566 9.35371 29.0663 10.1397 29.3759C10.9019 29.6713 11.7737 29.8761 13.0552 29.9333C14.3366 29.9905 14.7416 30.0048 18.0048 30.0048C21.268 30.0048 21.6729 29.9905 22.9544 29.9333C24.2311 29.8761 25.1028 29.6713 25.8698 29.3759C26.6606 29.0711 27.3275 28.6566 27.9945 27.9897C28.6614 27.3227 29.0711 26.6511 29.3807 25.865C29.6761 25.1028 29.8809 24.231 29.9381 22.9496C29.9953 21.6681 30.0096 21.2632 30.0096 18C30.0096 14.7368 29.9953 14.3319 29.9381 13.0504C29.8809 11.7737 29.6761 10.9019 29.3807 10.135C29.0758 9.34418 28.6614 8.67725 27.9945 8.01032C27.3275 7.34339 26.6558 6.9337 25.8698 6.62406C25.1076 6.3287 24.2358 6.12386 22.9544 6.06669C21.6681 6.01429 21.2584 6 18 6Z"
                            fill="#121212"
                          />
                          <path
                            d="M18.0003 11.8398C14.5989 11.8398 11.8359 14.5981 11.8359 18.0042C11.8359 21.4103 14.5942 24.1685 18.0003 24.1685C21.4064 24.1685 24.1646 21.4103 24.1646 18.0042C24.1646 14.5981 21.4064 11.8398 18.0003 11.8398ZM18.0003 22.001C15.7899 22.001 13.9987 20.2098 13.9987 17.9994C13.9987 15.789 15.7899 13.9978 18.0003 13.9978C20.2107 13.9978 22.0019 15.789 22.0019 17.9994C22.0019 20.2098 20.2107 22.001 18.0003 22.001Z"
                            fill="#121212"
                          />
                          <path
                            d="M24.4074 13.0316C25.202 13.0316 25.8461 12.3875 25.8461 11.593C25.8461 10.7984 25.202 10.1543 24.4074 10.1543C23.6129 10.1543 22.9688 10.7984 22.9688 11.593C22.9688 12.3875 23.6129 13.0316 24.4074 13.0316Z"
                            fill="#121212"
                          />
                        </g>
                        <defs>
                          <filter
                            id="filter0_d_6235_26983"
                            x="0"
                            y="0"
                            width="40.0098"
                            height="40.0049"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                          >
                            <feFlood
                              flood-opacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dx="2" dy="2" />
                            <feGaussianBlur stdDeviation="4" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_6235_26983"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_6235_26983"
                              result="shape"
                            />
                          </filter>
                        </defs>
                      </svg>{" "}
                    </a>
                  )}
                  {entertainList?.youtubeUrl && (
                    <a
                      href={entertainList.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="45"
                        height="40"
                        viewBox="0 0 45 40"
                        fill="none"
                      >
                        <g filter="url(#filter0_d_8998_29142)">
                          <path
                            d="M20.5 6C20.5 6 11.431 5.99995 9.16904 6.62695C7.92059 6.97195 6.93955 7.98832 6.60605 9.27832C5.99995 11.6183 6 18 6 18C6 18 5.99995 24.3817 6.60605 26.7217C6.93955 28.0132 7.92204 29.028 9.16904 29.373C11.431 30 20.5 30 20.5 30C20.5 30 29.569 30 31.831 29.373C33.078 29.028 34.0604 28.0117 34.3939 26.7217C35 24.3817 35 18 35 18C35 18 35 11.6183 34.3939 9.27832C34.0604 7.98832 33.078 6.97195 31.831 6.62695C29.569 5.99995 20.5 6 20.5 6ZM20.5 9C24.6789 9 29.9118 9.20041 31.0805 9.52441C31.3255 9.59191 31.5264 9.79969 31.5931 10.0547C31.9425 11.4017 32.1 15.513 32.1 18C32.1 20.487 31.9425 24.5968 31.5931 25.9453C31.5278 26.1988 31.327 26.4066 31.0805 26.4756C29.9132 26.7996 24.6789 27 20.5 27C16.3226 27 11.0897 26.7996 9.91953 26.4756C9.67448 26.4081 9.47363 26.2003 9.40693 25.9453C9.05748 24.5983 8.9 20.487 8.9 18C8.9 15.513 9.05748 11.4018 9.40693 10.0518C9.47218 9.79976 9.67303 9.59191 9.91953 9.52441C11.0868 9.20041 16.3211 9 20.5 9ZM17.6 12.8027V23.1973L26.3 18L17.6 12.8027Z"
                            fill="#121212"
                          />
                        </g>
                        <defs>
                          <filter
                            id="filter0_d_8998_29142"
                            x="0"
                            y="0"
                            width="45"
                            height="40"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                          >
                            <feFlood
                              flood-opacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dx="2" dy="2" />
                            <feGaussianBlur stdDeviation="4" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_8998_29142"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_8998_29142"
                              result="shape"
                            />
                          </filter>
                        </defs>
                      </svg>{" "}
                    </a>
                  )}
                  {entertainList?.kakaoUrl && (
                    <a
                      href={entertainList.kakaoUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <KAKAO className={styles.sns_icon} />
                    </a>
                  )}
                  {entertainList?.url && (
                    <a
                      href={entertainList.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        fill="none"
                      >
                        <g filter="url(#filter0_d_6235_26984)">
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M18.9623 7.8305C21.403 5.38983 25.4388 5.38983 27.8795 7.8305C30.3202 10.2712 30.3202 14.3069 27.8795 16.7476L23.4253 21.2018C21.3053 23.4974 17.8555 23.618 15.4788 22.0336C14.6483 21.4799 14.4239 20.3579 14.9775 19.5274C15.5312 18.697 16.6532 18.4726 17.4837 19.0262C18.565 19.747 20.0081 19.5877 20.7825 18.7359C20.8018 18.7147 20.8216 18.694 20.8418 18.6737L25.3237 14.1918C26.3529 13.1627 26.3529 11.4154 25.3237 10.3863C24.3314 9.39396 22.6715 9.35843 21.6313 10.2797L21.4548 10.5446C20.9011 11.375 19.7791 11.5994 18.9486 11.0458C18.1181 10.4922 17.8937 9.37012 18.4474 8.53966L18.7365 8.10593C18.8025 8.00691 18.8782 7.91465 18.9623 7.8305Z"
                            fill="#121212"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M12.3746 14.5663C14.5031 12.6313 17.7788 12.1233 20.3131 14.024C21.1116 14.6228 21.2734 15.7556 20.6745 16.5541C20.0757 17.3525 18.9429 17.5144 18.1444 16.9155C17.2202 16.2223 15.8907 16.2826 14.8443 17.2064L10.4064 21.7873L10.3863 21.8078C9.35713 22.8369 9.35713 24.5842 10.3863 25.6134C11.4155 26.6425 13.1627 26.6425 14.1919 25.6134L15.4698 26.8912L14.1919 25.6134L14.6256 25.1796C15.3314 24.4739 16.4756 24.4739 17.1814 25.1796C17.8872 25.8854 17.8872 27.0297 17.1814 27.7354L16.7477 28.1691C14.307 30.6098 10.2712 30.6098 7.83051 28.1691C5.3935 25.7321 5.38984 21.7048 7.81952 19.263L12.2923 14.646C12.3189 14.6186 12.3463 14.592 12.3746 14.5663Z"
                            fill="#121212"
                          />
                        </g>
                        <defs>
                          <filter
                            id="filter0_d_6235_26984"
                            x="0"
                            y="0"
                            width="39.7109"
                            height="40"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                          >
                            <feFlood
                              flood-opacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dx="2" dy="2" />
                            <feGaussianBlur stdDeviation="4" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_6235_26984"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_6235_26984"
                              result="shape"
                            />
                          </filter>
                        </defs>
                      </svg>{" "}
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
                      <span className={styles.fixed_Info}>소개글</span>
                    </div>
                    <span className={styles.variable_Info}>
                      {entertainList?.introductionLetter || "소개글 정보 없음"}
                    </span>
                  </div>
                  <div className={styles.info_Box}>
                    <div className={styles.fixed_Info}>장소</div>
                    <span className={styles.variable_Info}>
                      {entertainList?.location || "장소 정보 없음"}
                    </span>
                  </div>
                  <div className={styles.info_Box}>
                    <div className={styles.fixed_Info}>날짜</div>
                    <span className={styles.variable_Info}>
                      {entertainList?.date || "날짜 정보 없음"}
                    </span>
                  </div>
                  <div className={styles.info_Box}>
                    <div className={styles.fixed_Info}>시간</div>
                    <span className={styles.variable_Info}>
                      {entertainList?.timeList || "시간 정보 없음"}
                    </span>
                  </div>
                  <div className={styles.info_Box}>
                    <div className={styles.fixed_Info}>담당자</div>
                    <span className={styles.variable_Info}>
                      {entertainList?.managerPhoneNumber || "담당자 정보 없음"}{" "}
                      {entertainList?.manager
                        ? ` (${entertainList.manager})`
                        : ""}
                    </span>
                  </div>

                  <div className={styles.info_Box}>
                    <div className={styles.textBox}>
                      <div className={styles.fixed_Info}>기타정보</div>
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

export default EntertainDetailMobile;
