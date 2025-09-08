import React from "react";
import styles from "./styles/Footer.module.css";
import { useNavigate } from "react-router-dom";

import moboggaLogo from "../assets/footer/footer_mobogga_logo.svg";
import likelionLogo from "../assets/footer/footer_likelion_logo.svg";
import likelionhguLogo from "../assets/footer/footer_likelionhgu_logo.svg";
import instaLink from "../assets/footer/footer_insta_link.svg";
import moboggaLink from "../assets/footer/footer_mobogga_link.svg";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className={styles.footer}>
      {/* <div className={styles.firstContainer}>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/faq");
            setTimeout(() => {
              if (window.scrollToSection) window.scrollToSection("info");
            }, 300);
          }}
        >
          모보까소개
        </div>
        {""}|{""}
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/faq");
            setTimeout(() => {
              if (window.scrollToSection) window.scrollToSection("faq");
            }, 300);
          }}
        >
          FAQ
        </div>
        {""}|{""}
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/faq");
            setTimeout(() => {
              if (window.scrollToSection) window.scrollToSection("contact");
            }, 300);
          }}
        >
          문의
        </div>
      </div> */}

      <div className={styles.secondContainer}>
        <div className={styles.logos}>
          <img
            onClick={() =>
              navigate("/")
            }
            src={moboggaLogo}
            className={styles.logoImg}
            alt=""
          />
          <div className={styles.verticalLine}></div>
          <img
            onClick={() => window.open("https://likelion.net/", "_blank")}
            src={likelionLogo}
            className={styles.likelion}
            alt=""
          />
          <div className={styles.verticalLine}></div>
          <img
            onClick={() =>
              window.open("https://www.instagram.com/likelion_hgu/", "_blank")
            }
            src={likelionhguLogo}
            className={styles.likelionhgu}
            alt=""
          />
        </div>
        <div>
          이 프로젝트는 멋쟁이사자처럼 한동대 소속 학생들의 아이디어로
          탄생하였습니다.
        </div>
        <div className={styles.contact}>
          <span>연락처: 010-9543-8893</span> |{" "}
          <span>메일: moboggahandong@gmail.com</span>
        </div>

        <div className={styles.address}>주소: 경상북도 포항시 북구 흥해읍 한동로 558, 한동대학교</div>
        <div className={styles.links}>
          <div
            className={styles.mobogga}
            onClick={() =>
              navigate("/faq")
            }
          >
            <img src={moboggaLink} alt="" />
          </div>
          <div
            className={styles.insta}
            onClick={() =>
              window.open(
                "https://www.instagram.com/mobogga_handong/",
                "_blank"
              )
            }
          >
            <img src={instaLink} alt="" />
          </div>
        </div>

        <span className={styles.copyRight}>
          Copyright © MOBOGGA. All rights reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
