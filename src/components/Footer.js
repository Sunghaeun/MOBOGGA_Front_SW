import React from "react";
// import {useNavigate} from "react-router-dom";
import styles from "./styles/Footer.module.css";

import moboggaLogo from "../assets/FooterLogo.svg";
import insta from "../assets/instagram.svg";

function Footer() {
  // const navigate = useNavigate();

  return (
    <footer className={styles.footer}>
      <div className={styles.firstContainer}>
        <div>모보까소개</div>
        <div>FAQ</div>
        <div>문의</div>
      </div>

      <div className={styles.secondContainer}>
        <img src={moboggaLogo} className={styles.logoImg} alt="" />
        <p className={styles.contact}>
          <span>
            <a href="tel:+821095438893">연락처: 010-9543-8893</a>
          </span>{" "}
          |{" "}
          <span>
            <a href="mailto:mobogga.service@gmail.com">
              메일: mobogga.service@gmail.com
            </a>
          </span>
        </p>

        <p>주소: 경상북도 포항시 북구 흥해읍 한동로 558, 한동대학교</p>
        <div
          className={styles.insta}
          onClick={() =>
            window.open("https://www.instagram.com/mobogga_handong/", "_blank")
          }
        >
          <img src={insta} alt="" />
          <span>instagram</span>
        </div>
        <span>Copyright © MOBOGGA. All rights reserved.</span>
      </div>
    </footer>
  );
}

export default Footer;
