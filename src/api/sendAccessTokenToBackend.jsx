// src/api/sendAccessTokenToBackend.js
import axios from "axios";

const sendAccessTokenToBackend = async (idToken, navigate) => {
  try {
    // 환경변수 체크
    if (!process.env.REACT_APP_API_URL) {
      throw new Error(
        "API URL이 설정되지 않았습니다. 환경변수를 확인해주세요."
      );
    }

    const apiUrl = `${process.env.REACT_APP_API_URL}/api/oauth/google/session`;
    console.log("API URL:", process.env.REACT_APP_API_URL);
    console.log("Full request URL:", apiUrl);
    console.log(
      "Sending request with idToken:",
      idToken?.substring(0, 50) + "..."
    );

    // 서버 연결 테스트를 위한 간단한 요청 먼저 시도
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/health`, {
        timeout: 5000,
      });
      console.log("Health check passed");
    } catch (healthError) {
      console.warn(
        "Health check failed, but proceeding with main request:",
        healthError.message
      );
    }

    const response = await axios.post(
      apiUrl,
      { credential: idToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        timeout: 15000, // 15초 타임아웃으로 증가
      }
    );
    console.log("Response from backend:", response.data);

    const jwt = response.data.token;
    localStorage.setItem("jwt", jwt);
    console.log("Login successful, JWT stored:", jwt?.substring(0, 20) + "...");

    const isFirst = response.data.first;
    if (isFirst) {
      navigate("/add-info");
      return;
    } else {
      navigate("/main");
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
      switch (status) {
        case 400:
          throw new Error("잘못된 요청입니다. 다시 로그인해주세요.");
        case 401:
          throw new Error("인증에 실패했습니다. 다시 로그인해주세요.");
        case 403:
          throw new Error("접근 권한이 없습니다.");
        case 404:
          throw new Error(
            "API 엔드포인트를 찾을 수 없습니다. 서버 설정을 확인해주세요."
          );
        case 500:
          throw new Error(
            "서버 내부 오류가 발생했습니다. 관리자에게 문의해주세요."
          );
        default:
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
