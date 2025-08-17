import axios from "axios";
import useAuthStore from "../stores/authStore";

/**
 * Zustand 스토어와 연동된 API 클라이언트
 * 모든 API 호출에서 자동으로 인증 헤더 추가
 */
class ApiClient {
  constructor() {
    // axios 인스턴스 생성
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      withCredentials: true,
    });

    // 요청 인터셉터: 자동으로 Authorization 헤더 추가
    this.client.interceptors.request.use(
      (config) => {
        const { token } = useAuthStore.getState();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 응답 인터셉터: 401/403 에러 시 선택적 로그아웃
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.log("🔍 API 에러 응답 분석:", {
          status: error.response?.status,
          url: error.config?.url,
          method: error.config?.method,
          message: error.message,
          data: error.response?.data,
        });

        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log("🚨 API 응답에서 인증 실패 감지");
          console.log("요청 URL:", error.config?.url);
          console.log("응답 데이터:", error.response?.data);
          console.log("현재 토큰 존재 여부:", !!useAuthStore.getState().token);
          console.log("현재 사용자 정보:", useAuthStore.getState().user);

          // 중요한 인증 관련 API에서만 로그아웃 수행
          const url = error.config?.url || "";
          const shouldLogout =
            url.includes("/auth/") ||
            url.includes("/oauth/") ||
            url.includes("/login") ||
            url.includes("/token");

          if (shouldLogout) {
            console.log("🚨 중요한 인증 API 실패 - 자동 로그아웃 실행");
            const { logout } = useAuthStore.getState();
            logout();
          } else {
            console.log(
              "⚠️ 데이터 조회 API 실패 - 로그아웃하지 않고 에러만 처리"
            );
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // 편의 메서드들
  get(url, config = {}) {
    return this.client.get(url, config);
  }

  post(url, data, config = {}) {
    return this.client.post(url, data, config);
  }

  put(url, data, config = {}) {
    return this.client.put(url, data, config);
  }

  delete(url, config = {}) {
    return this.client.delete(url, config);
  }

  // 직접 axios 인스턴스 접근
  getInstance() {
    return this.client;
  }
}

// 싱글톤 인스턴스
const apiClient = new ApiClient();

export default apiClient;
