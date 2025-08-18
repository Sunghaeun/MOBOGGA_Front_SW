// src/api/sendAccessTokenToBackend.js
import apiClient from "../utils/apiClient";
import useAuthStore from "../stores/authStore";

const sendAccessTokenToBackend = async (idToken, navigate) => {
  try {
    // 환경변수 체크
    if (!process.env.REACT_APP_API_URL) {
      throw new Error(
        "API URL이 설정되지 않았습니다. 환경변수를 확인해주세요."
      );
    }

    console.log("API URL:", process.env.REACT_APP_API_URL);
    console.log("Request payload:", {
      credential: idToken?.substring(0, 50) + "...",
    });
    console.log(
      "Sending request with idToken:",
      idToken?.substring(0, 50) + "..."
    );

    console.log("Starting main OAuth request...");
    console.log("Request details:", {
      url: "/api/oauth/google/session",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
      timeout: 30000,
    });

    // 요청 전 로그
    console.log("About to send OAuth request...");

    // OAuth 요청은 토큰이 없는 상태이므로 직접 axios 인스턴스 사용
    const response = await apiClient.getInstance().post(
      "/api/oauth/google/session",
      { credential: idToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        timeout: 30000, // 30초로 타임아웃 늘림 (OAuth 토큰 검증은 시간이 걸릴 수 있음)
        onUploadProgress: (progressEvent) => {
          console.log("Upload progress:", progressEvent);
        },
        onDownloadProgress: (progressEvent) => {
          console.log("Download progress:", progressEvent);
        },
      }
    );

    console.log("Response received!");
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    console.log("Response from backend:", response.data);

    // 쿠키 설정 확인
    console.log("Document cookies after login:", document.cookie);

    console.log("Login successful, session created via cookie");

    // Zustand 스토어에 토큰 저장
    if (response.data.token) {
      console.log("토큰 받음:", response.data.token.substring(0, 30) + "...");
      const { setToken } = useAuthStore.getState();
      setToken(response.data.token);
      console.log("Zustand 스토어에 토큰 저장 완료");
    } else {
      console.warn("백엔드에서 토큰을 받지 못했습니다!");
    }

    // 전역 인증 상태 업데이트 이벤트 발생 (하위 호환성)
    window.dispatchEvent(new CustomEvent("authStateChanged"));

    const isFirst = response.data.first;
    if (isFirst) {
      // 로그인 완료 후 약간의 지연을 두어 상태 업데이트가 완료되도록 함
      setTimeout(() => {
        navigate("/add-info");
      }, 100);
      return;
    } else {
      // 로그인 완료 후 약간의 지연을 두어 상태 업데이트가 완료되도록 함
      setTimeout(() => {
        navigate("/main");
      }, 100);
    }
  } catch (error) {
    console.error("Full error object:", error);
    console.error("Error response:", error.response);
    console.error("Error request:", error.request);

    // 네트워크 에러 처리
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      console.error("Network error details:", {
        code: error.code,
        message: error.message,
        config: error.config,
      });

      throw new Error(
        "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하거나 관리자에게 문의해주세요."
      );
    }

    // 타임아웃 에러 처리
    if (error.code === "ECONNABORTED") {
      throw new Error("요청 시간이 초과되었습니다. 서버가 응답하지 않습니다.");
    }

    // HTTP 에러 처리
    if (error.response) {
      const status = error.response.status;
      // 백엔드가 제공한 message 또는 error 필드 우선 사용
      let backendMessage = null;
      const respData = error.response.data;
      if (respData) {
        if (typeof respData === "string") {
          const trimmed = respData.trim();
          if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
            try {
              const parsed = JSON.parse(trimmed);
              backendMessage = parsed?.message || parsed?.error || null;
            } catch (e) {
              // JSON 파싱 실패하면 문자열 전체를 사용
              backendMessage = trimmed || null;
            }
          } else {
            backendMessage = trimmed || null;
          }
        } else if (typeof respData === "object") {
          backendMessage = respData?.message || respData?.error || null;
        }
      }

      switch (status) {
        case 400:
          if (backendMessage) {
            throw new Error(backendMessage);
          }
          throw new Error("잘못된 요청입니다. 다시 로그인해주세요.");
        case 401:
          if (backendMessage) {
            throw new Error(backendMessage);
          }
          throw new Error("인증에 실패했습니다. 다시 로그인해주세요.");
        case 403:
          if (backendMessage) {
            throw new Error(backendMessage);
          }
          throw new Error("접근 권한이 없습니다.");
        case 404:
          if (backendMessage) {
            throw new Error(backendMessage);
          }
          throw new Error(
            "API 엔드포인트를 찾을 수 없습니다. 서버 설정을 확인해주세요."
          );
        case 500:
          if (backendMessage) {
            throw new Error(backendMessage);
          }
          throw new Error(
            "서버 내부 오류가 발생했습니다. 관리자에게 문의해주세요."
          );
        default:
          if (backendMessage) {
            throw new Error(backendMessage);
          }
          throw new Error(
            `서버 오류 (${status}): ${
              error.response.data?.message || "관리자에게 문의해주세요."
            }`
          );
      }
    }

    throw error;
  }
};

export default sendAccessTokenToBackend;
