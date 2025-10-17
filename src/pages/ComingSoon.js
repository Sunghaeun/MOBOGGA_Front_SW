import styles from "./styles/Landing.module.css";
import LandingPageMobile from "../assets/LandingPageMobile.svg";

function ComingSoon() {
  return (
    <>
      <div className={styles.body}>
        <div className={styles.tape_box}>
          <img
            className={styles.landing_mobile}
            src={LandingPageMobile}
            alt=""
          />
        </div>
        {/* <div className={styles.landing_mobile_btn}>모보까 로그인</div>
        <div className={styles.login_caution}>
          <div className={styles.caution}>
            *한동대학교 이메일 계정으로 로그인해주세요.
          </div>
        </div> */}
      </div>
      {/* 딤처리 오버레이 */}
      <div className={styles.overlay}>
        <div className={styles.overlayText}>
          <div>
            현재<span className={styles.highlight}> 서버 점검</span> 중입니다.
            <br />
            <div className={styles.subText}>
              <span style={{ fontSize: "24px" }}>점검 시간: 2025.10.17(금) 20시 ~ 24시 (4시간)</span>
              <br />
              <br />
              {/* <span style={{ fontSize: "14px", opacity: 0.8 }}>
                모바일 버전은 <span className={styles.highlight}>9월 1일</span>{" "}
                출시 예정입니다:)
              </span> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ComingSoon;
