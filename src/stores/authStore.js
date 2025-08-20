import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Zustand 기반 인증 스토어
 * - 토큰: sessionStorage에 안전하게 저장 (탭 종료 시 자동 삭제)
 * - 사용자 정보: auth/me API로 실시간 조회
 * - 중앙집중식 상태 관리
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      // === 상태 ===
      token: null,
      user: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,

      // === 토큰 관리 ===
      setToken: (token) => {
        set({ token, error: null });
        // 토큰이 설정되면 즉시 사용자 정보 조회
        if (token) {
          get().fetchUser();
        }
      },

      clearToken: () => {
        set({
          token: null,
          user: null,
          isLoggedIn: false,
          error: null,
        });
      },

      // === 사용자 정보 관리 ===
      setUser: (user) => {
        set({
          user,
          isLoggedIn: !!user,
          isLoading: false,
          error: null,
        });
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => {
        set({ error, isLoading: false });
      },

      // === API 호출 함수들 ===
      fetchUser: async () => {
        const { token } = get();
        if (!token) {
          return null;
        }

        try {
          set({ isLoading: true, error: null });

          // apiClient는 동적으로 import (순환 참조 방지)
          const { default: apiClient } = await import("../utils/apiClient");
          const response = await apiClient.get("/api/auth/me");

          const user = response.data;
          get().setUser(user);
          return user;
        } catch (error) {
          // 401/403 에러면 토큰이 무효하므로 정리
          if (
            error.response?.status === 401 ||
            error.response?.status === 403
          ) {
            get().logout();
          } else {
            get().setError("사용자 정보를 불러올 수 없습니다.");
          }
          return null;
        }
      },

      logout: async () => {
        const { token } = get();

        // 서버에 로그아웃 요청 (선택사항)
        if (token) {
          try {
            const { default: apiClient } = await import("../utils/apiClient");
            await apiClient.post("/api/auth/logout");
          } catch (error) {}
        }

        // 로컬 상태 정리
        get().clearToken();
      },

      // === 유틸리티 함수들 ===
      getAuthHeaders: () => {
        const { token } = get();
        return token ? { Authorization: `Bearer ${token}` } : {};
      },

      getApiConfig: () => {
        const { token } = get();
        return {
          withCredentials: true,
          ...(token && { headers: { Authorization: `Bearer ${token}` } }),
        };
      },

      isManager: () => {
        const { user } = get();
        return user && user.authority === "ROLE_CLUB";
      },

      isAdmin: () => {
        const { user } = get();
        return user && user.authority === "ROLE_ADMIN";
      },

      // === 초기화 함수 ===
      initialize: async () => {
        const { token } = get();
        if (token) {
          await get().fetchUser();
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "mobogga-auth", // sessionStorage 키
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
      partialize: (state) => ({
        token: state.token, // 토큰만 persist (사용자 정보는 매번 새로 가져옴)
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          state.initialize();
        }
      },
    }
  )
);

export default useAuthStore;
