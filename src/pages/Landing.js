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

  const onClickGoogleStartBtn = () => {
    const state = Math.random().toString(36).substring(2);
    sessionStorage.setItem("oauth_state", state);

    const nonce =
      Math.random().toString(36).substring(2) + Date.now().toString(36);

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

    window.location.href = authUrl.toString();
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
          </div>
        </div>
      </>
    );
  }
}

export default Landing;
