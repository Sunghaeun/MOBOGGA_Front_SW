import React from "react";
import styles from "./styles/FAQ.module.css";
import Tape from "../assets/faq/faq_tape.svg";
import ScrollBtn from "../assets/faq/faq_scroll.svg";
import Info from "../assets/faq/faq_info.svg";
import Qna from "../assets/faq/faq_qna.svg";

function FAQ() {
  return (
    <>
      <div className={styles.main}>
        <img src={Tape} alt="Tape" />
        <img src={ScrollBtn} alt="Scroll Button" className={styles.scrollBtn} />
        <img src={Info} alt="Info" className={styles.info} />
        <img src={Qna} alt="Q&A" className={styles.qna} />
      </div>
    </>
  );
}

export default FAQ;