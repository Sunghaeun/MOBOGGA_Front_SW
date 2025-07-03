// src/pages/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("jwt");
    sessionStorage.clear(); // userName, stdId, phoneNum 등 모두 삭제

    navigate("/main");
  }, [navigate]);

  return <div>로그아웃 중입니다...</div>;
}

export default Logout;
