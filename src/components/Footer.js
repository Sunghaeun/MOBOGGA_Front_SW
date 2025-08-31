import React from "react";
import styles from "./styles/Footer.module.css";

import moboggaLogo from "../assets/FooterLogo.svg";
import insta from "../assets/instagram.svg";

function Footer() {
  // const navigate = useNavigate();

  if (window.innerWidth < 768) {
    return (
      <footer className={styles.footer}>
        <div className={styles.firstContainer}>
          <span>모보까소개</span>{" "}
          |{" "}
          <span>FAQ</span>{" "}
          |{" "}
          <span>문의</span>{" "}
          |{" "}
          <span
            className={styles.insta}
            onClick={() =>
              window.open(
                "https://www.instagram.com/mobogga_handong/",
                "_blank"
              )
            }
          >
            <img src={insta} alt="" />
            <span>instagram</span>
          </span>
        </div>

        <div className={styles.secondContainer}>
          <img src={moboggaLogo} className={styles.logoImg} alt="" />
          <div className={styles.contact}>
            <span>
              <a href="tel:+821095438893">연락처: 010-9543-8893</a>
            </span>{" "}
            |{" "}
            <span>
              <a href="mailto:moboggahandong@gmail.com">
                메일: moboggahandong@gmail.com
              </a>
            </span>
          </div>

          <div>주소: 경상북도 포항시 북구 흥해읍 한동로 558, 한동대학교</div>
          <span className={styles.copyRight}>
            Copyright © MOBOGGA. All rights reserved.
          </span>
        </div>
      </footer>
    );
  } else {
    return (
      <footer className={styles.footer}>
        <div className={styles.firstContainer}>
          <div>모보까소개</div>
          <div>FAQ</div>
          <div>문의</div>
        </div>

        <div className={styles.secondContainer}>
          <img src={moboggaLogo} className={styles.logoImg} alt="" />
          <div className={styles.contact}>
            <span>
              <a href="tel:+821095438893">연락처: 010-9543-8893</a>
            </span>{" "}
            |{" "}
            <span>
              <a href="mailto:moboggahandong@gmail.com">
                메일: moboggahandong@gmail.com
              </a>
            </span>
          </div>

          <div>주소: 경상북도 포항시 북구 흥해읍 한동로 558, 한동대학교</div>
          <div
            className={styles.insta}
            onClick={() =>
              window.open(
                "https://www.instagram.com/mobogga_handong/",
                "_blank"
              )
            }
          >
            <img src={insta} alt="" />
            <span>instagram</span>
          </div>
          <span className={styles.copyRight}>
            Copyright © MOBOGGA. All rights reserved.
          </span>
        </div>
      </footer>
    );
  }
}

export default Footer;
