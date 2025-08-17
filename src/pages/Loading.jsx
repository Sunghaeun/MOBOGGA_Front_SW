// src/pages/Loading.jsx
import React, { useEffect, useState } from "react";
import sendAccessTokenToBackend from "../api/sendAccessTokenToBackend";
import { useNavigate } from "react-router-dom";
import styles from "./styles/Loading.module.css";
import ServerErrorModal from "../components/Mypage/ServerErrorModal";

const Loading = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log("OAuth 콜백 처리 시작");
        console.log("현재 URL:", window.location.href);

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
          console.log("백엔드에서 토큰 받음:", token.substring(0, 20) + "...");

          // 쿠키 기반 인증으로 변경되어 JWT 저장 불필요

          // 첫 로그인 여부에 따라 페이지 이동
          if (isFirst === "true") {
            console.log("첫 로그인 - 추가정보 입력 페이지로 이동");
            navigate("/add-info");
          } else {
            console.log("기존 사용자 - 메인 페이지로 이동");
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
          console.log("id_token 방식 처리");

          const savedState = sessionStorage.getItem("oauth_state");

          if (state !== savedState) {
            throw new Error("CSRF 방지를 위한 상태 값이 일치하지 않습니다.");
          }

          if (!state || !savedState || state !== savedState) {
            throw new Error("CSRF 방지를 위한 상태 값이 유효하지 않습니다.");
          }

          console.log("받은 idToken:", idToken.substring(0, 20) + "...");
          console.log("저장된 state:", savedState);
          console.log("받은 state:", state);

          // 서버로 전송
          console.log("백엔드로 idToken 전송 시작...");
          await sendAccessTokenToBackend(idToken, navigate);
          console.log("백엔드 응답 처리 완료");
          return;
        }

        // 토큰도 없고 id_token도 없으면 에러
        throw new Error("인증 정보가 없습니다. 로그인을 다시 해주세요.");
      } catch (error) {
        console.error("OAuth 콜백 처리 중 에러:", error);
        setError(error.message);
        setIsErrorModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  const handleErrorModalClose = () => {
    setIsErrorModalOpen(false);
    navigate("/login");
  };

  return (
    <div id="loading">
      {isLoading && <div className={styles.loading_text}>로딩 중...</div>}
      {!isLoading && error && (
        <div className={styles.error_text}>
          {error}
          <br />
          <button onClick={() => navigate("/login")}>
            로그인 페이지로 이동
          </button>
        </div>
      )}

      <ServerErrorModal
        isOpen={isErrorModalOpen}
        onClose={handleErrorModalClose}
        errorMessage={error}
      />
    </div>
  );
};

export default Loading;
