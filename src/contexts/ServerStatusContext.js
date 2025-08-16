import React, { createContext, useContext, useState, useCallback } from "react";

const ServerStatusContext = createContext();

export const useServerStatus = () => {
  const context = useContext(ServerStatusContext);
  if (!context) {
    throw new Error(
      "useServerStatus must be used within a ServerStatusProvider"
    );
  }
  return context;
};

export const ServerStatusProvider = ({ children }) => {
  const [isServerDown, setIsServerDown] = useState(false);
  const [lastErrorTime, setLastErrorTime] = useState(null);

  // 서버 다운 감지
  const handleServerError = useCallback((error, response = null) => {
    console.log("=== SERVER ERROR DETECTED ===");
    console.log("Error:", error);
    console.log("Response:", response);

    // 네트워크 에러 또는 서버 응답 없음 감지
    const isNetworkError =
      !navigator.onLine || // 오프라인 상태
      error?.name === "TypeError" ||
      error?.message?.includes("fetch") ||
      error?.message?.includes("NetworkError") ||
      error?.message?.includes("Failed to fetch") ||
      error?.message?.includes("ERR_NETWORK") ||
      error?.message?.includes("ERR_INTERNET_DISCONNECTED") ||
      (response &&
        (response.status === 0 || // 네트워크 에러
          response.status >= 500 || // 서버 에러
          response.status === 502 || // Bad Gateway
          response.status === 503 || // Service Unavailable
          response.status === 504)); // Gateway Timeout

    if (isNetworkError) {
      console.log("Server down detected - showing modal");
      setIsServerDown(true);
      setLastErrorTime(new Date());
      return true;
    }

    return false;
  }, []);

  // 서버 연결 재시도
  const retryConnection = useCallback(async () => {
    console.log("=== RETRYING SERVER CONNECTION ===");

    try {
      // 간단한 핑 요청으로 서버 상태 확인 (실제 존재하는 엔드포인트 사용)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5초 타임아웃

      // 실제 존재하는 API 엔드포인트를 사용 (예: 메인 페이지 데이터)
      const response = await fetch(`${process.env.REACT_APP_API_URL}/main`, {
        method: "GET",
        signal: controller.signal,
        cache: "no-cache",
      });

      clearTimeout(timeoutId);

      if (response.ok || response.status === 401) {
        // 401도 서버가 응답하는 것으로 간주
        console.log("Server connection restored");
        setIsServerDown(false);
        setLastErrorTime(null);
        return true;
      } else {
        console.log("Server still not responding properly");
        return false;
      }
    } catch (error) {
      console.log("Retry failed:", error);
      return false;
    }
  }, []);

  // 모달 닫기 (사용자가 직접 닫는 경우)
  const closeModal = useCallback(() => {
    setIsServerDown(false);
  }, []);

  const value = {
    isServerDown,
    lastErrorTime,
    handleServerError,
    retryConnection,
    closeModal,
  };

  return (
    <ServerStatusContext.Provider value={value}>
      {children}
    </ServerStatusContext.Provider>
  );
};
