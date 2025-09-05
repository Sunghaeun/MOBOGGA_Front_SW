import React from "react";
import styles from "./styles/FAQ.module.css";
import Tape from "../assets/faq/faq_tape.svg";
import MobileTape from "../assets/faq/mobile_tape.svg";
import ScrollBtn from "../assets/faq/faq_scroll.svg";
import Info from "../assets/faq/faq_info.svg";
import MobileInfo from "../assets/faq/mobile_info.svg";

function FAQ() {
  // FAQ 페이지 진입 시 window.scrollToSection 등록
  React.useEffect(() => {
    window.scrollToSection = handleScrollToSection;
    return () => {
      window.scrollToSection = undefined;
    };
  }, []);
  // 각 섹션 ref 생성
  const infoRef = React.useRef(null);
  const qnaRef = React.useRef(null);
  const contactRef = React.useRef(null);

  // 스크롤 핸들러 (id 우선, ref fallback)
  const handleScrollToSection = (section) => {
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      return;
    }
    let ref = null;
    if (section === "info") ref = infoRef;
    else if (section === "faq") ref = qnaRef;
    else if (section === "contact") ref = contactRef;
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 클립보드 복사 핸들러
  const handleCopy = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert("클립보드에 복사되었습니다.");
    } else {
      alert("클립보드 복사를 지원하지 않는 환경입니다.");
    }
  };

  return (
    <>
      <div className={styles.main}>
        <img src={window.innerWidth < 768 ? MobileTape : Tape} alt="Tape" />
        <img
          src={ScrollBtn}
          alt="Scroll Button"
          className={styles.scrollBtn}
          style={{ display: window.innerWidth < 768 ? "none" : "block" }}
          onClick={() => handleScrollToSection("faq")}
        />
        <img
          id="info"
          ref={infoRef}
          src={window.innerWidth < 768 ? MobileInfo : Info}
          alt="Info"
          className={styles.content}
        />
        <div id="faq" className={styles.qnaSection} ref={qnaRef}>
          <h1 className={styles.title}>자주 묻는 질문</h1>

          <div className={styles.category}>학생</div>
          <div className={styles.qna}>
            <div className={styles.question}>
              Q. 공연 예매를 하고 송금 QR을 못 찍었어요. 어디서 송금 계좌번호를
              확인할 수 있나요?
            </div>
            <div className={styles.answer}>
              A. 마이페이지 - 공연예매내역에서 확인하실 수 있습니다.
            </div>
          </div>
          <div className={styles.qna}>
            <div className={styles.question}>
              Q. 공연 예매 후 입금을 했는데, 마이페이지에서 '확인대기'라고만
              떠요
            </div>
            <div className={styles.answer}>
              A. 공연 주최 동아리에서 예매 확인이 아직 이뤄지지 않은 경우입니다.
              긴 시간 지속될 경우 동아리 담당자에게 직접 문의하시면 됩니다.
              마이페이지 - 공연예매내역에서 동아리 담당자 전화번호를 확인하실 수
              있습니다.
            </div>
          </div>
          <div className={styles.qna}>
            <div className={styles.question}>
              Q. 공연 예매 후 결제는 어떻게 이루어지나요?
            </div>
            <div className={styles.answer}>
              A. (PC 기준) 예매 후 나타나는 팝업창에서 QR코드를 찍거나
              계좌번호를 통해 송금하실 수 있습니다.<br></br>
              (모바일 기준) 카카오페이로 송금하기를 누르시고 카카오톡이 열리면
              '나에게 보내기'를 선택하시면 됩니다. 이후 나와의 채팅방으로 보내진
              송금 관련 정보를 확인하시고, 송금을 진행하시면 됩니다.
            </div>
          </div>
          <div className={styles.qna}>
            <div className={styles.question}>
              Q. 공연 예매를 취소하고 싶어요. 어떻게 하면 되나요?
            </div>
            <div className={styles.answer}>
              A. 마이페이지 - 공연예매내역에 들어가셔서 취소를 원하는 해당
              공연에서 우측 상단의 예매취소 버튼을 누르시면 됩니다. 이후 나오는
              창에서 '확인'을 눌러주시면 예매 취소 요청이 동아리 관리자에게
              전송됩니다.
            </div>
          </div>

          <div className={styles.category}>동아리</div>
          <div className={styles.qna}>
            <div className={styles.question}>
              Q. 총동연의 승인을 받은 아기 동아리입니다! 등록을 원하는데 어떻게
              하면 되나요?
            </div>
            <div className={styles.answer}>
              A. 모보까 서비스의 동아리 등록 절차는 다음과 같습니다!<br></br>
              모보까의 동아리 등록은 노션 내 [관리 권한 부여] 챕터를
              참고해주세요! 형식에 맞게 보내주시면, 소통 후 2-3일 이내로 모보까
              관리자 버전 서비스를 이용하실 수 있는 계정을 드릴 예정입니다.{" "}
              <a href="https://festive-tumble-6e3.notion.site/MOBOGGA-264cf6181de6804d9799e81b74f74c1f?source=copy_link">
                노션 링크
              </a>
            </div>
          </div>
          <div className={styles.qna}>
            <div className={styles.question}>
              Q. 저희 동아리는 이번 공연 때 얼리버드 행사가 있습니다. 얼리버드
              공연을 어떤 방법으로 생성하면 될까요?
            </div>
            <div className={styles.answer}>
              A. 처음에는 얼리버드 가격으로 공연을 등록해주시고, 얼리버드
              예매기간이 끝나는 날 직접 관리자 마이페이지 - 해당 공연에
              들어가셔서 가격을 수정해주시면 됩니다.
            </div>
          </div>
          <div className={styles.qna}>
            <div className={styles.question}>
              Q. 동아리장 페이지는 모바일로도 접속할 수 있나요?
            </div>
            <div className={styles.answer}>
              A. 아쉽게도 불가능합니다. 현재 학생들이 이용할 수 있는 페이지만
              PC와 모바일 버전으로 구현되어 있습니다. 동아리 관리자 페이지는
              PC로 접속하셔야 합니다.
            </div>
          </div>
          <div className={styles.qna}>
            <div className={styles.question}>
              Q. 한 동아리가 여러 개의 계정을 생성할 수 있나요?
            </div>
            <div className={styles.answer}>
              A. 한 동아리 당 하나의 계정만 생성하실 수 있습니다.
            </div>
          </div>
          <div className={styles.category}>기타 질문</div>
          <div className={styles.qna}>
            <div className={styles.question}>
              Q. 모보까에 타 공동체(동호회, 학회, 신앙공동체, 학부 내 행사 등) 등록이
              가능한가요?
            </div>
            <div className={styles.answer}>
              A. 모보까는 교내 동아리를 위한 웹 서비스로, 현재로써는 등록이
              어렵습니다.
            </div>
          </div>
        </div>
        <div id="contact" className={styles.contactSection} ref={contactRef}>
          <h1 className={styles.title}>문의</h1>
          <div className={styles.question}>
            필요한 기능 및 피드백이 있으시면 모보까의 더 나은 발전을 위해 언제든지
            아래의 메일 또는 전화번호로 문의 부탁드립니다:)
          </div>
          <div className={styles.contactInfo}>
            <div className={styles.email}>
              메일:{" "}
              <span onClick={() => handleCopy("moboggahandong@gmail.com")}>
                moboggahandong@gmail.com
              </span>
            </div>
            <div className={styles.phone}>
              전화:{" "}
              <span onClick={() => handleCopy("010-9543-8893")}>
                010-9543-8893
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FAQ;
