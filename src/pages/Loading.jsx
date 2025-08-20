// src/pages/Loading.jsx
import React, { useEffect, useState } from "react";
import sendAccessTokenToBackend from "../api/sendAccessTokenToBackend";
import { useNavigate } from "react-router-dom";
import styles from "./styles/Loading.module.css";
import loadingStyles from "../styles/Loading.module.css";

const Loading = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // OAuth callback handling started

        // URL 파라미터에서 토큰 확인 (백엔드 리다이렉트)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const isFirst = urlParams.get("first");
        const error = urlParams.get("error");

        // 에러 처리
        if (error) {
          throw new Error(`OAuth 에러: ${decodeURIComponent(error)}`);
        }

        // 토큰이 있으면 백엔드에서 리다이렉트된 것
        if (token) {
          // 받은 토큰 처리: 쿠키 기반 인증으로 변경되어 JWT 저장 불필요
          if (isFirst === "true") {
            navigate("/add-info");
          } else {
            navigate("/main");
          }
          return;
        }

        // 토큰이 없으면 기존 방식 (id_token 처리)
        const parsedHash = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const idToken = parsedHash.get("id_token");
        const state = parsedHash.get("state");

        if (idToken) {
          // id_token flow

          const savedState = sessionStorage.getItem("oauth_state");

          if (state !== savedState) {
            throw new Error("CSRF 방지를 위한 상태 값이 일치하지 않습니다.");
          }

          if (!state || !savedState || state !== savedState) {
            throw new Error("CSRF 방지를 위한 상태 값이 유효하지 않습니다.");
          }

          await sendAccessTokenToBackend(idToken, navigate);
          return;
        }

        // 토큰도 없고 id_token도 없으면 에러
        throw new Error("인증 정보가 없습니다. 로그인을 다시 해주세요.");
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div id={styles.loading} className={loadingStyles.pageContainer}>
      {isLoading && (
        <div className={loadingStyles.loading}>
          <div className={loadingStyles.loadingSpinner}></div>
          <div className={loadingStyles.loadingText}>
            로그인 처리 중입니다
            <span className={loadingStyles.loadingDots}>...</span>
          </div>
          <div className={loadingStyles.loadingSubtext}>
            잠시만 기다려주세요
          </div>
        </div>
      )}

      {!isLoading && error && (
        <div className={loadingStyles.error}>
          <div className={loadingStyles.errorIcon}>⚠️</div>
          <div className={loadingStyles.errorMessage}>
            {error.split("\n").map((line, idx) => (
              <React.Fragment key={idx}>
                {line
                  .split(/(\*\*[^*]+\*\*)/)
                  .map((part, i) =>
                    part.startsWith("**") && part.endsWith("**") ? (
                      <strong key={i}>{part.slice(2, -2)}</strong>
                    ) : (
                      part
                    )
                  )}
                {idx !== error.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
          <button
            onClick={() => navigate("/login")}
            className={loadingStyles.retryBtn}
          >
            로그인 페이지로 이동
          </button>
        </div>
      )}
    </div>
  );
};

export default Loading;
