import React from "react";
import styles from "./styles/KakaoLinkButton.module.css";

const TossAppLauncher = () => {
  const isAndroid = /android/i.test(navigator.userAgent);
  const isiOS = /iphone|ipad/i.test(navigator.userAgent);

  const openToss = () => {
    const recipient = "01012345678"; // 받는사람 전화번호
    const amount = 10000; // 송금 금액
    const message = encodeURIComponent("모보까 송금");
    const tossLink = `supertoss://send?recipient=${recipient}&amount=${amount}&message=${message}`;

    const now = Date.now();
    setTimeout(() => {
      if (Date.now() - now < 2000) {
        if (isAndroid) {
          window.location.href =
            "https://play.google.com/store/apps/details?id=viva.republica.toss";
        } else if (isiOS) {
          window.location.href = "https://apps.apple.com/app/id839333328";
        }
      }
    }, 1500);
    if (isAndroid) {
      window.location.href = `intent://send?recipient=${recipient}&amount=${amount}&message=${message}#Intent;scheme=tosspay;package=viva.republica.toss;end;`;
    } else if (isiOS) {
      window.location.href = tossLink;
    } else {
      alert("모바일에서만 지원됩니다.");
    }
  };

  return (
    <button className={styles.kakao_btn} onClick={openToss}>
      토스로 송금하기
    </button>
  );
};

export default TossAppLauncher;
