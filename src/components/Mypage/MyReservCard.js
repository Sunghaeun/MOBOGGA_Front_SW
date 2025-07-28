/*eslint-disable*/
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/MyReservCard.module.css";
import Modal from "../Modal"; // Assuming Modal is a separate component

function MyReservCard({ data }) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [secondModalOpen, setSecondModalOpen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

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
    ticketCount,
    price,
    paid,
  } = data;

  const handleShowDetail = () => {
    navigate(`/show/${showId}`);
  };

  const show = { qrImage: "" }; // 또는 실제 데이터
  const selectedSch = { cost: price }; // 예시: price 사용
  const count = ticketCount || 1; // 예시: 티켓 수
  const formatPrice = (v) => v.toLocaleString() + "원";

  return (
    <div className={styles.card}>
      <div className={styles.card_img_box}>
        <img className={styles.card_img} src={poster} alt="공연 이미지" onClick={handleShowDetail} />
      </div>
      <div className={styles.card_text_box}>
        <div className={styles.card_title} onClick={handleShowDetail}>{title || "공연 제목 없음"}</div>
        <div className={styles.card_info_box}>
          <div className={styles.card_content}>
            <div className={styles.card_info_header} id={styles.order_box}>
              <div className={styles.card_order}>
                {order || "공연 정보 없음"}
              </div>
              <div className={styles.card_date}>
                {date || "날짜 정보 없음"} (
                {weekday || "날짜 정보 없음"})
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
          {paid === false && (
            isMobile ? (
              <>
                {!showAccount ? (
                  <button
                    className={styles.account_btn}
                    onClick={() => setSecondModalOpen(true)}
                  >
                    송금 정보 보기
                  </button>
                ) : (
                  <div className={styles.card_content}>
                    <div className={styles.card_info_header} id={styles.account_box}>
                      계좌번호:
                    </div>
                    <div className={styles.card_account}>{accountInfo}</div>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.card_content} id={styles.account_info}>
                <div className={styles.card_info_header} id={styles.account_box}>
                  계좌번호:
                </div>
                <div className={styles.card_account}>{accountInfo}</div>
              </div>
            )
          )}
          <div className={styles.ticket_info}>
            <div className={styles.ticket_num}>{ticketCount}매</div>
            <span className={styles.divider} />
            <div className={styles.ticket_price}>{price?.toLocaleString()}원</div>
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
            <button className={styles.modal_close} onClick={() => setSecondModalOpen(false)}>×</button>
          </div>
          <div className={styles.modal_mid}>
            <div className={styles.modal_qr_wrap}>
              <img className={styles.modal_qr_img} src={show.qrImage} alt="QR 코드" />
            </div>
            <div className={styles.modal_account}>
              <span className={styles.modal_strong_bl}>
                한동은행 1001 - 1234 - 5678 -90
              </span>
            </div>
            <div className={styles.modal_desc}>
              혹은 <span className={styles.modal_strong_bl}>QR코드</span>로 <span className={styles.modal_strong_bl}>{formatPrice((selectedSch?.cost || 0) * count)}</span> 송금 해주세요.<br />
              입금자명은 <span className={styles.modal_strong_or}>학번+이름</span>으로 해주세요.<br />
              계좌번호는 마이페이지에서 다시 볼 수 있습니다.
            </div>
            <a
              className={styles.kakao_btn}
              href="https://mobogga.netlify.app/main"
              target="_blank"
              rel="noopener noreferrer"
            >
              카카오페이로 송금하기
            </a>
          </div>
        </Modal>
      )}
    </div>
  );
}
export default MyReservCard;
