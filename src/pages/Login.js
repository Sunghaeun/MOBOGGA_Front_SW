// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import styles from "./styles/Login.module.css";
import LoginLogo from "../assets/LoginLogo.svg";
import GoogleLoginBtnDefault from "../assets/GoogleLoginBtn-Default.svg";
import GoogleLoginBtnHover from "../assets/GoogleLoginBtn-Hover.svg";

function Login() {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useAuth();
  const [isHovering, setIsHovering] = useState(false);

  // 이미 로그인된 사용자 체크
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      // 로그인되어 있으면 메인 페이지로 이동
      navigate("/main");
    }
  }, [navigate, isLoggedIn, isLoading]);

  const onMouseOver = () => setIsHovering(true);
  const onMouseOut = () => setIsHovering(false);

  // 보안 강화된 랜덤 문자열 생성
  const generateSecureRandom = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(36))
      .join("")
      .substring(0, 32);
  };

  const onClickGoogleLoginBtn = () => {
    // 환경변수 체크
    if (
      !process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID ||
      !process.env.REACT_APP_GOOGLE_AUTH_REDIRECT_URI
    ) {
      console.error("Google OAuth 환경변수가 설정되지 않았습니다.");
      alert("로그인 설정에 문제가 있습니다. 관리자에게 문의해주세요.");
      return;
    }

    try {
      const state = generateSecureRandom();
      const nonce = generateSecureRandom();

      // state와 nonce 저장
      sessionStorage.setItem("oauth_state", state);
      sessionStorage.setItem("oauth_nonce", nonce);

      console.log("Starting OAuth flow with direct Google API");
      console.log(
        "Redirect URI:",
        process.env.REACT_APP_GOOGLE_AUTH_REDIRECT_URI
      );

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

      console.log("OAuth URL:", authUrl.toString());
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error("OAuth 로그인 중 오류:", error);
      alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.logo_box}>
        <img className={styles.login_logo} src={LoginLogo} alt="login_logo" />
      </div>
      <div className={styles.words_box}>
        <div className={styles.words}>
          교내 공연 정보와 동아리 정보 확인은
          <br />
          모두 <span className={styles.highlight_word}>모보까</span>로
          시작하세요!
          <br />
          로그인을 하시면 더 많은 모보까 서비스를
          <br />
          이용하실 수 있습니다.
        </div>
      </div>
      <div>
        <img
          className={styles.google_login_btn}
          src={isHovering ? GoogleLoginBtnHover : GoogleLoginBtnDefault}
          alt="google_login_btn"
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          onClick={onClickGoogleLoginBtn}
        />
        <div className={styles.login_caution}>
          <div className={styles.caution}>*한동대학교 이메일 계정으로 로그인해주세요.</div>
        </div>
      </div>
    </div>
  );
}

export default Login;
