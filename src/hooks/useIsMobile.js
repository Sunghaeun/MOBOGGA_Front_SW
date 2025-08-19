import { useState, useEffect } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      // 화면 크기로 모바일 감지 (768px 이하)
      const screenWidth = window.innerWidth <= 768;

      // User Agent로 모바일 기기 감지
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileDevices =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileDevice = mobileDevices.test(userAgent);

      // 터치 지원 여부
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // 조건 중 하나라도 참이면 모바일로 간주
      setIsMobile(screenWidth || isMobileDevice || hasTouch);
    };

    // 초기 체크
    checkIsMobile();

    // 리사이즈 이벤트 리스너
    window.addEventListener("resize", checkIsMobile);

    // 클린업
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return isMobile;
}

export default useIsMobile;
