import { useNavigate } from "react-router-dom";
import styles from "./styles/ReservManageCard.module.css";
import showHolderBtn from "../../assets/manager/show_holder_btn.svg";
import showEditBtn from "../../assets/manager/show_edit_btn.svg";
import showDeleteBtn from "../../assets/manager/show_delete_btn.svg";

function ReservManageCard({ data }) {
  const navigate = useNavigate();
  if (!data) return null;

  const { scheduleId, poster, title, order, applyPeople, maxPeople } = data;

  const handleHolderList = () => {
    navigate(`/manager/holder/${scheduleId}`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.card_img_box}>
        <img
          className={styles.card_img}
          src={poster}
          alt="공연 이미지"
          onClick={handleHolderList}
        />
      </div>
      <div className={styles.card_text_box}>
        <div className={styles.card_title} onClick={handleHolderList}>
          {title || "공연 제목 없음"}
        </div>
        <div className={styles.card_info_box}>
          <div className={styles.card_info} id={styles.order_box}>
            <div className={styles.card_order}>{order || "공연 정보 없음"}</div>
            <div className={styles.card_applyPeople}>
              현황: {applyPeople}/{maxPeople}
            </div>
          </div>
          <div className={styles.card_btn_box}>
            <div className={styles.card_btn_img_box}>
              <img
                className={styles.card_btn}
                src={showHolderBtn}
                onClick={handleHolderList}
                alt="예매자 목록"
              />
            </div>
            <div className={styles.card_btn_img_box}>
              <img
                className={styles.card_btn}
                src={showEditBtn}
                onClick={() => navigate(`/manager/edit/${scheduleId}`)}
                alt="공연 수정"
              />
            </div>
            <div className={styles.card_btn_img_box}>
              <img
                className={styles.card_btn}
                src={showDeleteBtn}
                onClick={() => navigate(`/manager/delete/${scheduleId}`)}
                alt="공연 삭제"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ReservManageCard;
