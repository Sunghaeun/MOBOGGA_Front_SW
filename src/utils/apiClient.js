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
        // console.log(
        //   "API Request:",
        //   config.url,
        //   "Token:",
        //   token ? "Present" : "Missing"
        // ); // 디버깅용
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    // 응답 인터셉터: 인증 실패(401/403)시 필요하면 로그아웃 처리
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // console.error("API Error:", error.response?.status, error.config?.url); // 디버깅용
        if (error.response?.status === 401 || error.response?.status === 403) {
          const url = error.config?.url || "";
          const shouldLogout =
            url.includes("/auth/") ||
            url.includes("/oauth/") ||
            url.includes("/login") ||
            url.includes("/token");

          if (shouldLogout) {
            const { logout } = useAuthStore.getState();
            if (typeof logout === "function") logout();
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
