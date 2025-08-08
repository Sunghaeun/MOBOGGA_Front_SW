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
            <p>
              <span className={styles.highlight}>8월 20일</span> 모보까 오픈
              예정 !<br />
              <p className={styles.subText}>
                공연 예매부터 동아리 리크루팅까지
                <br />
                한동의 모든 동아리 소식을{" "}
                <span className={styles.highlight}>한 곳에서</span> 만나보세요
              </p>
            </p>
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
            <p>
              <span className={styles.highlight}>8월 20일</span> 모보까 오픈
              예정 !<br />
              <p className={styles.subText}>
                공연 예매부터 동아리 리크루팅까지
                <br />
                한동의 모든 동아리 소식을{" "}
                <span className={styles.highlight}>한 곳에서</span> 만나보세요
              </p>
            </p>
          </div>
        </div>
      </>
    );
  }
}

export default ComingSoon;
