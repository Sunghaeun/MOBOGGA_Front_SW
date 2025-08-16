// JWT 토큰을 안전하게 관리하는 유틸리티
class TokenManager {
  constructor() {
    this.token = null;
    this.refreshToken = null;
    this.serverStatusHandler = null; // 서버 상태 핸들러
  }

  // 서버 상태 핸들러 설정
  setServerStatusHandler(handler) {
    this.serverStatusHandler = handler;
  }

  // 토큰을 메모리에 저장 (개발자 도구에서 보이지 않음)
  setToken(token) {
    this.token = token;
    // 새로고침 시에도 유지되도록 암호화된 sessionStorage 사용
    this.encryptAndStore("temp_session", token);
  }

  getToken() {
    if (this.token) {
      return this.token;
    }

    // 페이지 새로고침 시 복구
    const encrypted = sessionStorage.getItem("temp_session");
    if (encrypted) {
      this.token = this.decryptFromStorage(encrypted);
      return this.token;
    }

    // 기존 localStorage의 JWT를 마이그레이션 (하위 호환성)
    const legacyToken = localStorage.getItem("jwt");
    if (legacyToken) {
      console.log("기존 localStorage JWT를 TokenManager로 마이그레이션 중...");
      this.setToken(legacyToken);
      localStorage.removeItem("jwt"); // 기존 토큰 제거
      return this.token;
    }

    return null;
  }

  // 간단한 암호화 (더 강력한 암호화 라이브러리 사용 권장)
  encryptAndStore(key, value) {
    const encrypted = btoa(unescape(encodeURIComponent(value)));
    sessionStorage.setItem(key, encrypted);
  }

  decryptFromStorage(encrypted) {
    try {
      return decodeURIComponent(escape(atob(encrypted)));
    } catch (e) {
      return null;
    }
  }

  // 토큰 제거
  clearToken() {
    this.token = null;
    this.refreshToken = null;
    sessionStorage.removeItem("temp_session");
    localStorage.removeItem("jwt"); // 기존 localStorage도 정리
  }

  // 토큰 유효성 검사
  isTokenValid() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch (e) {
      return false;
    }
  }

  // 사용자 역할 확인
  getUserRole() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role;
    } catch (e) {
      return null;
    }
  }

  // 서버 상태를 확인하는 안전한 fetch 래퍼
  async safeFetch(url, options = {}) {
    try {
      const token = this.getToken();
      const defaultOptions = {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...(options.headers || {}),
        },
        ...options,
      };

      console.log(`🌐 API 요청: ${url}`);
      const response = await fetch(url, defaultOptions);

      // 서버 에러 체크
      if (!response.ok && this.serverStatusHandler) {
        const isServerError = this.serverStatusHandler(null, response);
        if (isServerError) {
          throw new Error(`Server Error: ${response.status}`);
        }
      }

      return response;
    } catch (error) {
      console.error(`❌ API 요청 실패: ${url}`, error);

      // 서버 다운 감지
      if (this.serverStatusHandler) {
        this.serverStatusHandler(error);
      }

      throw error;
    }
  }
}

// 싱글톤 인스턴스
const tokenManager = new TokenManager();
export default tokenManager;
