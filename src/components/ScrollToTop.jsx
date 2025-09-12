import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation(); // 현재 페이지 경로를 가져옴

  useEffect(() => {
    window.scrollTo(0, 0); // 페이지 경로가 변경될 때마다 스크롤을 최상단으로 이동
  }, [pathname]); // pathname이 변경될 때마다 실행됨

  return null; // 이 컴포넌트는 렌더링할 것이 없으므로 null을 반환
};

export default ScrollToTop;
