import { useEffect } from "react";
import styles from "./styles/KakaoLinkButton.module.css";

const KakaoLinkButton = ({ data }) => {
  useEffect(() => {
    // SDK 로드
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init("5a3515ec9cd5d9410290ac4b61ddd479");
      }
    };
    document.body.appendChild(script);
  }, []);

  const { accountInfo } = data;

  const sendKakaoMessage = () => {
    if (!window.Kakao) return;
    window.Kakao.Link.sendDefault({
      objectType: "text",
      text: `💸 송금 부탁드립니다!\n\n${accountInfo}\n예금주: 홍길동`,
      link: {
        mobileWebUrl: "https://mobogga.netlify.app/pay",
        webUrl: "https://mobogga.netlify.app/pay",
      },
      buttons: [
        {
          title: "송금 안내 페이지",
          link: {
            mobileWebUrl: "https://mobogga.netlify.app/pay",
            webUrl: "https://mobogga.netlify.app/pay",
          },
        },
      ],
    });
  };

  return (
    <button className={styles.kakao_btn} onClick={sendKakaoMessage}>
      {" "}
      카카오페이로 송금하기
    </button>
  );
};

export default KakaoLinkButton;
