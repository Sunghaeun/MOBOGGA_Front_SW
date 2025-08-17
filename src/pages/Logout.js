// src/pages/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    // useAuth 훅의 logout 함수 사용 (쿠키 기반 로그아웃)
    logout();
    sessionStorage.clear(); // userName, stdId, phoneNum 등 모두 삭제

    navigate("/main");
  }, [navigate, logout]);

  return <div>로그아웃 중입니다...</div>;
}

export default Logout;
