import { useNavigate } from "react-router-dom";
import styles from "./styles/ShowManageCard.module.css";
import showHolderBtn from "../../assets/manager/show_holder_btn.svg";
import showEditBtn from "../../assets/manager/show_edit_btn.svg";
import showDeleteBtn from "../../assets/manager/show_delete_btn.svg";

function ShowManageCard({ data }) {
  const navigate = useNavigate();
  if (!data) return null;

  const { scheduleId, poster, title, date } = data;

  return (
    <div className={styles.card}>
      <div className={styles.card_img_box}>
        <img
          className={styles.card_img}
          src={poster}
          alt="공연 이미지"
          onClick={() => navigate(`/manager/edit/${scheduleId}`)}
        />
      </div>
      <div className={styles.card_text_box}>
        <div className={styles.card_title} onClick={() => navigate(`/manager/show/${scheduleId}`)}>
          {title || "공연 제목 없음"}
        </div>
        <div className={styles.card_info_box}>
          <div className={styles.card_info} id={styles.order_box}>
            <div className={styles.card_date}>{date || "날짜 정보 없음"}</div>
          </div>
          <div className={styles.card_btn_box}>
            <div className={styles.card_btn_img_box}>
              <img
                className={styles.card_btn}
                src={showHolderBtn}
                onClick={() => navigate(`/manager/holder/${scheduleId}`)}
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
export default ShowManageCard;
