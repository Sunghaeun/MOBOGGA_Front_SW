import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/MyReservCard.module.css";

function MyReservCard({ data }) {
  const navigate = useNavigate();
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
  }

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
          <div
            className={
              paid === false ? styles.card_content : styles.card_content_hidden
            }
            id={styles.account_info}
          >
            <div className={styles.card_info_header} id={styles.account_box}>
              계좌번호:
            </div>
            <div className={styles.card_account}>{accountInfo}</div>
          </div>
          <div className={styles.ticket_info}>
            <div className={styles.ticket_num}>{ticketCount}매</div>
            <div className={styles.ticket_price}>
              {price?.toLocaleString()}원
            </div>
            <div className={styles.deposit_status}>
              {paid ? (
                <span style={{ color: "#1AAE00" }}>입금완료</span>
              ) : (
                <span style={{ color: "var(--ORANGE)" }}>미입금</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MyReservCard;
