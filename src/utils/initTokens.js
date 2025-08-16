// 토큰 마이그레이션 및 초기화 유틸리티
import tokenManager from "./tokenManager";

export const initializeTokens = () => {
  console.log("=== 토큰 초기화 및 마이그레이션 시작 ===");

  const legacyToken = localStorage.getItem("jwt");
  const currentToken = tokenManager.getToken();

  console.log("Legacy token exists:", !!legacyToken);
  console.log("Current token exists:", !!currentToken);

  if (legacyToken && !currentToken) {
    console.log("기존 localStorage JWT를 TokenManager로 마이그레이션 중...");
    tokenManager.setToken(legacyToken);
    console.log("마이그레이션 완료");
  }

  if (currentToken && tokenManager.isTokenValid()) {
    console.log("유효한 토큰이 존재합니다.");
    return true;
  } else if (currentToken && !tokenManager.isTokenValid()) {
    console.log("만료된 토큰을 정리합니다.");
    tokenManager.clearToken();
    return false;
  }

  console.log("토큰이 없습니다.");
  return false;
};

export default initializeTokens;
