import styles from "./styles/Landing.module.css";
import LandingPageTape from "../assets/LandingPageTape.svg";
import LandingPageWords from "../assets/LandingPageWords.svg";
import LandingPageMobile from "../assets/LandingPageMobile.svg";

function ComingSoon() {
  if (window.innerWidth < 768) {
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
          <div className={styles.landing_mobile_btn}>모보까 로그인</div>
        </div>
        {/* 딤처리 오버레이 */}
        <div className={styles.overlay}>
          <div className={styles.overlayText}>
            <div>
              <span className={styles.highlight}>모바일 버전</span> 준비
              중입니다 !<br />
              <div className={styles.subText}>
                현재 모바일 환경은 개발 중입니다
                <br />
                PC 환경에서 모보까를 이용해주세요
                <br />
                <br />
                <span style={{ fontSize: "14px", opacity: 0.8 }}>
                  모바일 버전은{" "}
                  <span className={styles.highlight}>9월 1일</span> 출시
                  예정입니다:)
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className={styles.body}>
          <div className={styles.tape_box}>
            <img className={styles.landing_tape} src={LandingPageTape} alt="" />
          </div>
          <div className={styles.words_box}>
            <div className={styles.words_img_box}>
              <img className={styles.words_img} src={LandingPageWords} alt="" />
            </div>
          </div>
        </div>

        {/* 딤처리 오버레이 */}
        <div className={styles.overlay}>
          <div className={styles.overlayText}>
            <div>
              <span className={styles.highlight}>8월 20일</span> 모보까 오픈
              예정 !<br />
              <div className={styles.subText}>
                공연 예매부터 동아리 리크루팅까지
                <br />
                한동의 모든 동아리 소식을{" "}
                <span className={styles.highlight}>한 곳에서</span> 만나보세요
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ComingSoon;
