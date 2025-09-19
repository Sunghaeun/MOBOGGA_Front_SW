import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./styles/KakaoLinkButton.module.css";

const KakaoLinkButton = ({ title, accountInfo, accountName, price }) => {
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [sdkError, setSdkError] = useState(null);

  useEffect(() => {
    // SDK 로드
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    script.onload = () => {
      try {
        if (window.Kakao && !window.Kakao.isInitialized()) {
          window.Kakao.init("5a3515ec9cd5d9410290ac4b61ddd479");
          setIsSdkLoaded(true);
        } else {
          setSdkError("Kakao SDK 초기화 실패");
        }
      } catch (error) {
        setSdkError("Kakao SDK 초기화 중 오류 발생");
        console.error("Kakao SDK initialization error:", error);
      }
    };
    script.onerror = () => {
      setSdkError("Kakao SDK 로드 실패");
    };
    document.body.appendChild(script);

    return () => {
      // cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const sendKakaoMessage = () => {
    if (sdkError) {
      alert(`카카오톡 공유 서비스에 문제가 있습니다: ${sdkError}`);
      return;
    }

    if (!isSdkLoaded) {
      alert(
        "카카오톡 공유 서비스를 로드하는 중입니다. 잠시 후 다시 시도해주세요."
      );
      return;
    }

    if (!window.Kakao) {
      alert("카카오톡 공유 서비스를 사용할 수 없습니다.");
      return;
    }

    try {
      window.Kakao.Link.sendDefault({
        objectType: "text",
        text: `💸 송금 부탁드립니다!\n\n공연명: ${title}\n계좌번호: ${
          accountInfo || "계좌 정보 없음"
        }\n예금주: ${
          accountName || "예금주 정보 없음"
        }\n금액: ${price?.toLocaleString()}원`,
        link: {
          mobileWebUrl: "https://mobogga.netlify.app/faq",
          webUrl: "https://mobogga.netlify.app/faq",
        },
        buttons: [
          {
            title: "FAQ 페이지",
            link: {
              mobileWebUrl: "https://mobogga.netlify.app/faq",
              webUrl: "https://mobogga.netlify.app/faq",
            },
          },
        ],
      });
    } catch (error) {
      console.error("Kakao message send error:", error);
      alert("카카오톡 공유 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <button
      className={styles.kakao_btn}
      onClick={sendKakaoMessage}
      disabled={!isSdkLoaded || !!sdkError}
    >
      {sdkError
        ? "카카오톡 공유 오류"
        : !isSdkLoaded
        ? "로딩 중..."
        : "카카오페이로 송금하기"}
    </button>
  );
};

export default KakaoLinkButton;

KakaoLinkButton.propTypes = {
  title: PropTypes.string,
  accountInfo: PropTypes.string,
  accountName: PropTypes.string,
  price: PropTypes.number,
};
