/*eslint-disable*/
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./styles/MyReservCard.module.css";
import Modal from "../Modal"; // Assuming Modal is a separate component
import KakaoLinkButton from "./KakaoLinkButton";
import TossAppLauncher from "./TossAppLauncher";
import SeatModal from "../Seat/SeatModal";

function MyReservCard({ data }) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [secondModalOpen, setSecondModalOpen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [seatModalOpen, setSeatModalOpen] = useState(false);

  const handleCopyClipBoard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("클립보드에 링크가 복사되었습니다.");
    } catch (e) {
      alert("복사에 실패하였습니다");
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!data) return null;

  const {
    showId,
    poster,
    title,
    order,
    date,
    weekday,
    time,
    location,
    managerPhone,
    accountInfo,
    accountName,
    ticketCount,
    price,
    paid,
    seat,
  } = data;

  const handleShowDetail = () => {
    navigate(`/show/${showId}`);
  };

  const show = { qrImage: "" }; // 또는 실제 데이터
  const selectedSch = { cost: price }; // 예시: price 사용
  const count = ticketCount || 1; // 예시: 티켓 수

  return (
    <div className={styles.card}>
      <div className={styles.card_img_box}>
        <img
          className={styles.card_img}
          src={poster}
          alt="공연 이미지"
          onClick={handleShowDetail}
        />
      </div>
      <div className={styles.card_text_box}>
        <div className={styles.card_title} onClick={handleShowDetail}>
          {title || "공연 제목 없음"}
        </div>
        <div className={styles.card_info_box}>
          <div className={styles.card_content}>
            <div className={styles.card_info_header} id={styles.order_box}>
              <div className={styles.card_order}>
                {order || "공연 정보 없음"}
              </div>
              <div className={styles.card_date}>
                {date || "날짜 정보 없음"} ({weekday || "날짜 정보 없음"})
                {time ? ` ${time}` : ""}
              </div>
            </div>
          </div>
          <div className={styles.card_content}>
            <div className={styles.card_info_header}>장소: </div>
            <div className={styles.card_place}>
              {location || "장소 정보 없음"}
            </div>
          </div>
          <div className={styles.card_content}>
            <div className={styles.card_info_header}>담당자: </div>
            <div className={styles.card_manager}>
              {managerPhone || "정보 없음"}
            </div>
          </div>
          {/* 계좌정보: 모바일이면 버튼, PC면 그대로 노출 */}
          {paid === false &&
            (isMobile ? (
              <>
                {!showAccount ? (
                  <button
                    className={styles.account_btn}
                    onClick={() => setSecondModalOpen(true)}
                  >
                    송금정보 보기
                  </button>
                ) : (
                  <div className={styles.card_content}>
                    <div
                      className={styles.card_info_header}
                      id={styles.account_box}
                    >
                      계좌번호:
                    </div>
                    <div className={styles.card_account}>{accountInfo}</div>
                    <div
                      className={styles.card_account}
                      style={accountName ? {} : { display: "none" }}
                    >
                      {" "}
                      {" ("}
                      {accountName}
                      {")"}{" "}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className={styles.card_content}>
                  <div
                    className={styles.card_info_header}
                    id={styles.account_box}
                  >
                    계좌번호:
                  </div>
                  <div className={styles.card_account}>{accountInfo}</div>
                  <div
                    className={styles.card_account}
                    style={accountName ? {} : { display: "none" }}
                  >
                    {" "}
                    {" ("}
                    {accountName}
                    {")"}{" "}
                  </div>
                </div>
              </>
            ))}
          <div className={styles.card_content}>
            <div
              className={styles.seat_box}
              onClick={() => setSeatModalOpen(true)}
            >
              {seat || " A1, A2, A3, A4, A5, B1, B2, B3, B4, B5 "}{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="6"
                height="10"
                viewBox="0 0 6 10"
                fill="none"
              >
                <path
                  d="M1 0.5L4.79026 4.46967C5.06991 4.76256 5.06991 5.23744 4.79026 5.53033L1 9.5"
                  stroke="#FF3D12"
                  stroke-linecap="round"
                />
              </svg>
            </div>
          </div>
          <div className={styles.ticket_info}>
            <div className={styles.ticket_num}>{ticketCount}매</div>
            <span className={styles.divider} />
            <div className={styles.ticket_price}>
              {price?.toLocaleString()}원
            </div>
            <span className={styles.divider} />
            <div className={styles.deposit_status}>
              {paid ? (
                <span style={{ color: "#1AAE00" }}>예매확정</span>
              ) : (
                <span style={{ color: "var(--ORANGE)" }}>미확인</span>
              )}
            </div>
          </div>
        </div>
      </div>
      {secondModalOpen && (
        <Modal
          className={styles.modal_succ_re}
          isOpen={secondModalOpen}
          onClose={() => setSecondModalOpen(false)}
        >
          <div className={styles.modal_top}>
            <p className={styles.modal_title}>송금 정보</p>
            <button
              className={styles.modal_close}
              onClick={() => setSecondModalOpen(false)}
            >
              ×
            </button>
          </div>
          <div className={styles.modal_mid}>
            <div className={styles.modal_account}>
              <span className={styles.modal_strong_bl}>
                {accountInfo || "계좌 정보 없음"}
              </span>
              <span
                className={styles.modal_strong_bl}
                style={accountName ? {} : { display: "none" }}
              >
                {" "}
                {" ("}
                {accountName}
                {")"}{" "}
              </span>
              <button
                className={styles.modal_copy_btn}
                onClick={() => {
                  handleCopyClipBoard(accountInfo || "계좌 정보 없음");
                }}
              >
                복사
              </button>
            </div>
            <div className={styles.modal_desc}>
              입금하실 금액:{" "}
              <span className={styles.modal_strong_bl}>
                {price?.toLocaleString()}원
              </span>{" "}
              <br />
              입금자명은{" "}
              <span className={styles.modal_strong_or}>학번+이름</span>으로
              해주세요.
              <br />
              동아리 담당자의 확인 후 예매 확정이 이뤄집니다. <br />
            </div>
            <KakaoLinkButton
              title={title}
              accountInfo={accountInfo}
              accountName={accountName}
              price={price}
              target="_blank"
              rel="noopener noreferrer"
            ></KakaoLinkButton>
            <div style={{ fontSize: "0.7rem", color: "red" }}>
              *카카오톡이 열리면 ‘나에게' 보낸 후 계좌번호를 눌러서 송금
            </div>
            <TossAppLauncher
              managerPhone={managerPhone}
              price={price}
              target="_blank"
              rel="noopener noreferrer"
            ></TossAppLauncher>
          </div>
        </Modal>
      )}
      {seatModalOpen && (
        <SeatModal
          open={seatModalOpen}
          close={() => setSeatModalOpen(false)}
          onConfirm={() => setSeatModalOpen(false)}
        />
      )}
    </div>
  );
}
export default MyReservCard;

MyReservCard.propTypes = {
  data: PropTypes.shape({
    showId: PropTypes.string,
    poster: PropTypes.string,
    title: PropTypes.string,
    qrImage: PropTypes.string,
    order: PropTypes.string,
    date: PropTypes.string,
    weekday: PropTypes.string,
    time: PropTypes.string,
    location: PropTypes.string,
    managerPhone: PropTypes.string,
    accountInfo: PropTypes.string,
    accountName: PropTypes.string,
    ticketCount: PropTypes.number,
    price: PropTypes.number,
    paid: PropTypes.bool,
    seat: PropTypes.string,
  }).isRequired,
};
