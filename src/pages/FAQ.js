import React from "react";
import styles from "./styles/FAQ.module.css";
import Tape from "../assets/faq/faq_tape.svg";
import ScrollBtn from "../assets/faq/faq_scroll.svg";
import Info from "../assets/faq/faq_info.svg";

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
        <img src={Tape} alt="Tape" />
        <img
          src={ScrollBtn}
          alt="Scroll Button"
          className={styles.scrollBtn}
          onClick={() => handleScrollToSection("faq")}
        />
        <img
          id="info"
          ref={infoRef}
          src={Info}
          alt="Info"
          className={styles.content}
        />
        <div id="faq" className={styles.qnaSection} ref={qnaRef}>
          <h1 className={styles.title}>자주 묻는 질문</h1>

          <div className={styles.category}>학생</div>
          <div className={styles.qna}>
            <div className={styles.question}>
              Q. 결제하고 결제 QR을 못 찍었어요. 어디서 결제 계좌번호를 확인할
              수 있나요?
            </div>
            <div className={styles.answer}>
              A. 마이페이지 - 예약상세 내역에서 송금 계좌번호를 확인하실 수
              있습니다.
            </div>
          </div>
          <div className={styles.qna}>
            <div className={styles.question}>
              Q. 공연 예약을 했고 입금을 했는데, 마이페이지에서 계속 미입금으로
              떠요
            </div>
            <div className={styles.answer}>
              A. 공연 주최 동아리에서 예매 확인이 늦어지는 경우입니다. 이 경우
              동아리 담당자에게 직접 문의하시면 됩니다. 마이페이지 - 예매내역
              목록에서 동아리 담당자 전화번호를 확인하실 수 있습니다.
            </div>
          </div>
          <div className={styles.qna}>
            <div className={styles.question}>
              Q. 결제를 어떤 방법으로 하면 될까요?
            </div>
            <div className={styles.answer}>
              A. 카카오페이 QR의 경우 공유하기 클릭 후, “나에게 보내기”를
              누르시면 결제 관련한 정보가 카카오톡으로 보내집니다.
            </div>
          </div>
          <div className={styles.qna}>
            <div className={styles.question}>
              Q. 예매를 취소하는 방법은 무엇인가요?
            </div>
            <div className={styles.answer}>
              A. 예매 내역 우측 상단의 “X” 버튼을 누르시면 됩니다. 이후 나오는
              창에서 “예”를 눌러주시면 예매 취소 요청이 동아리 관리자 페이지로
              전송됩니다.
            </div>
          </div>

          <div className={styles.category}>동아리</div>
          <div className={styles.qna}>
            <div className={styles.question}>
              Q. 총동연의 승인을 받은 아기 동아리입니다! 등록을 하고 싶은데,
              어떤 방법으로 등록하면 좋을까요?
            </div>
            <div className={styles.answer}>
              A. 모보까 서비스의 동아리 등록 절차는 다음과 같습니다!<br></br>
              moboggahandong@gmail.com으로 동아리를 인증하실 수 있는 서류를
              첨부하여 메일을 보내주시면 모보까팀에서 동아리 담당자 성함,
              동아리에서 사용하는 메일 등을 요청드리게 됩니다. 소통 후 2-3일
              이내로 모보까 관리자 버전 서비스를 이용하실 수 있는 계정을 드릴
              예정입니다.
            </div>
          </div>
          <div className={styles.qna}>
            <div className={styles.question}>
              Q. 우리 동아리는 얼리버드 공연 행사가 있습니다. 공연 페이지를 어떤
              방법으로 생성하면 될까요?
            </div>
            <div className={styles.answer}>
              A. 처음에는 얼리버드 가격으로 공연을 등록해주시고, 얼리버드 공연이
              끝나는 날 직접 마이페이지 - 해당하는 공연에 들어가셔서 가격을
              수정해주시면 됩니다.
            </div>
          </div>
          <div className={styles.qna}>
            <div className={styles.question}>
              Q. 동아리장 페이지는 핸드폰으로 접근 가능한가요?
            </div>
            <div className={styles.answer}>
              A. 불가능합니다. 현재 학생 페이지만 웹, 앱으로 구성되어 있습니다.
              동아리장 페이지는 웹 버전, 즉 컴퓨터로 사용하셔야 합니다.
            </div>
          </div>
          <div className={styles.qna}>
            <div className={styles.question}>
              Q. 한 동아리에 여러 개 계정을 생성할 수 있나요?
            </div>
            <div className={styles.answer}>
              A. 한 동아리 당 하나의 계정만 생성하실 수 있습니다.
            </div>
          </div>
          <div className={styles.category}>기타 질문</div>
          <div className={styles.qna}>
            <div className={styles.question}>
              Q. 모보까에 타 단체(동호회, 학회, 학부 내 행사) 등록이 가능한가요?
            </div>
            <div className={styles.answer}>
              A. 모보까는 교내 동아리를 위한 웹 서비스로, 현재로서는 등록이
              어렵습니다.
            </div>
          </div>
        </div>
        <div className={styles.contactSection} ref={contactRef}>
          <div id="contact" className={styles.contactSection} ref={contactRef}>
            <h1 className={styles.title}>문의</h1>
            <div className={styles.question}>
              필요한 기능 및 피드백이 있으시면 모보까의 더 나은 발전을 위해
              편하게 아래로 업무 메일 및 전화번호로 문의 부탁드립니다:)
            </div>
            <div className={styles.contactInfo}>
              <div className={styles.email}>
                이메일:{" "}
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
      </div>
    </>
  );
}

export default FAQ;
