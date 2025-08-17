import { useEffect } from "react";
import useAuthStore from "../stores/authStore";

/**
 * 기존 useAuth 훅을 Zustand 스토어로 마이그레이션
 * 하위 호환성을 위해 동일한 API 제공
 */
const useAuth = () => {
  const {
    user: auth,
    isLoggedIn,
    isLoading,
    error,
    setToken: setTempToken,
    fetchUser: getAuth,
    logout,
    isManager,
    isAdmin,
    initialize,
  } = useAuthStore();

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    initialize();
  }, [initialize]);

  // 토큰 가져오기 (하위 호환성)
  const getToken = () => {
    return useAuthStore.getState().token;
  };

  return {
    auth,
    isLoggedIn,
    isLoading,
    error,
    getAuth,
    getToken,
    isManager,
    isAdmin: isAdmin,
    logout,
    setTempToken, // OAuth 콜백에서 사용
  };
};

export default useAuth;
