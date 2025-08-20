// src/pages/OAuthCallback.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/Loading.module.css";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // OAuth 콜백 처리 시작
        // 현재 URL에서 파라미터 추출
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");
        const error = urlParams.get("error");

        if (error) {
          throw new Error(`OAuth 에러: ${error}`);
        }

        if (!code) {
          throw new Error("OAuth 인증 코드가 없습니다.");
        }

        // OAuth 코드 수신 완료

        // 백엔드 API로 토큰 교환 요청
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/oauth/google/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              code: code,
              state: state,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`토큰 교환 실패: ${response.status}`);
        }

        const data = await response.json();

        if (!data.token) {
          throw new Error("JWT 토큰을 받지 못했습니다.");
        }

        // OAuth 인증 완료

        // 첫 로그인 여부에 따라 페이지 이동
        if (data.isFirst || data.first) {
          navigate("/add-info");
        } else {
          navigate("/main");
        }
      } catch (error) {
        // 에러 발생: 사용자에게 메시지 표시
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div id="oauth-callback">
      {isLoading && (
        <div className={styles.loading_text}>로그인 처리 중...</div>
      )}
      {!isLoading && error && (
        <div className={styles.error_text}>
          {error}
          <br />
          <button onClick={() => navigate("/login")}>
            로그인 페이지로 이동
          </button>
        </div>
      )}
    </div>
  );
};

export default OAuthCallback;
