// src/pages/OAuthCallback.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/Loading.module.css";
import tokenManager from "../utils/tokenManager";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log("OAuth 콜백 처리 시작");
        console.log("현재 URL:", window.location.href);

        // URL에서 파라미터 추출
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

        console.log("OAuth 코드 받음:", code.substring(0, 10) + "...");

        // 백엔드 API로 토큰 교환 요청
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/oauth/google/token`,
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
        console.log("백엔드 응답:", data);

        if (!data.token) {
          throw new Error("JWT 토큰을 받지 못했습니다.");
        }

        // JWT를 TokenManager를 통해 안전하게 저장
        tokenManager.setToken(data.token);
        console.log("JWT TokenManager에 안전하게 저장 완료");

        // 기존 시스템과의 호환성을 위해 localStorage에도 저장 (임시)
        localStorage.setItem("jwt", data.token);
        console.log("기존 호환성을 위해 localStorage에도 저장");

        // 첫 로그인 여부에 따라 페이지 이동
        if (data.isFirst || data.first) {
          console.log("첫 로그인 - 추가정보 입력 페이지로 이동");
          navigate("/add-info");
        } else {
          console.log("기존 사용자 - 메인 페이지로 이동");
          navigate("/main");
        }
      } catch (error) {
        console.error("OAuth 콜백 처리 중 에러:", error);
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
