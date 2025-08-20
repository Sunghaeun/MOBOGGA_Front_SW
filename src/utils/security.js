// 추가 보안 설정
export const SECURITY_CONFIG = {
  // 토큰 자동 갱신 시간 (분)
  TOKEN_REFRESH_INTERVAL: 50,

  // 세션 타임아웃 (분)
  SESSION_TIMEOUT: 60,

  // 개발자 도구 감지 (프로덕션에서만 활성화)
  DETECT_DEV_TOOLS: process.env.NODE_ENV === "production",

  // 토큰 암호화 키 (실제 프로덕션에서는 환경변수 사용)
  ENCRYPTION_KEY: process.env.REACT_APP_ENCRYPTION_KEY || "default-key",
};

// 개발자 도구 감지 (선택사항)
if (SECURITY_CONFIG.DETECT_DEV_TOOLS) {
  let devtools = { open: false, orientation: null };
  const threshold = 160;

  setInterval(() => {
    if (
      window.outerHeight - window.innerHeight > threshold ||
      window.outerWidth - window.innerWidth > threshold
    ) {
      if (!devtools.open) {
        devtools.open = true;
        // 개발자 도구 감지됨 - 필요한 보안 조치 적용 가능
      }
    } else {
      devtools.open = false;
    }
  }, 500);
}
