import React, { useState } from "react";
import styles from "./styles/Landing.module.css";
import GoogleStartBtnDefault from "../assets/GoogleStartBtn-Default.svg";
import GoogleStartBtnHover from "../assets/GoogleStartBtn-Hover.svg";
import LandingPageTape from "../assets/LandingPageTape.svg";
import LandingPageWords from "../assets/LandingPageWords.svg";
import LandingPageMobile from "../assets/LandingPageMobile.svg";

function Landing() {
  const [isHovering, setIsHovering] = useState(false);

  const onMouseOver = () => {
    setIsHovering(true);
  };

  const onMouseOut = () => {
    setIsHovering(false);
  };

  // 보안 강화된 랜덤 문자열 생성
  const generateSecureRandom = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(36))
      .join("")
      .substring(0, 32);
  };

  const onClickGoogleStartBtn = () => {
    // 환경변수 체크
    if (
      !process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID ||
      !process.env.REACT_APP_GOOGLE_AUTH_REDIRECT_URI
    ) {
      alert("로그인 설정에 문제가 있습니다. 관리자에게 문의해주세요.");
      return;
    }

    try {
      const state = generateSecureRandom();
      const nonce = generateSecureRandom();

      // state와 nonce 저장
      sessionStorage.setItem("oauth_state", state);
      sessionStorage.setItem("oauth_nonce", nonce);

      // OAuth flow 시작

      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.searchParams.append(
        "client_id",
        process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID
      );
      authUrl.searchParams.append(
        "redirect_uri",
        process.env.REACT_APP_GOOGLE_AUTH_REDIRECT_URI
      );
      authUrl.searchParams.append("response_type", "id_token");
      authUrl.searchParams.append("scope", "email profile openid");
      authUrl.searchParams.append("nonce", nonce);
      authUrl.searchParams.append("access_type", "offline");
      authUrl.searchParams.append("prompt", "consent");
      authUrl.searchParams.append("state", state);

      // Redirect to OAuth URL
      window.location.href = authUrl.toString();
    } catch (error) {
      // OAuth login error: show user-friendly alert
      alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  if (window.innerWidth < 768) {
    return (
      <>
        <div className={styles.body}>
          <div className={styles.tape_box}>
            <img
              className={styles.landing_mobile}
              src={LandingPageMobile}
              alt=""
            />
          </div>
          <div
            className={styles.landing_mobile_btn}
            onClick={onClickGoogleStartBtn}
          >
            모보까 로그인
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className={styles.body}>
          <div className={styles.tape_box}>
            <img className={styles.landing_tape} src={LandingPageTape} alt="" />
          </div>
          <div className={styles.words_box}>
            <div className={styles.words_img_box}>
              <img className={styles.words_img} src={LandingPageWords} alt="" />
            </div>
            <div className={styles.google_start_btn_box}>
              <img
                className={styles.google_start_btn}
                src={isHovering ? GoogleStartBtnHover : GoogleStartBtnDefault}
                alt="google-start-btn"
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onClick={onClickGoogleStartBtn}
              />
            </div>
            <div className={styles.login_caution}>
              <div className={styles.caution}>
                *한동대학교 이메일 계정으로 로그인해주세요.
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Landing;
