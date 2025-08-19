import { useNavigate } from "react-router-dom";
import styles from "./styles/ReservManageCard.module.css";
import showEditBtn from "../../assets/manager/show_edit_btn.svg";
// import showDeleteBtn from "../../assets/manager/show_delete_btn.svg";

function RecruitingCard({ data }) {
  const navigate = useNavigate();
  if (!data) return null;

  const { recruitingId, poster, date, title } = data;

  return (
    <div className={styles.card}>
      <div className={styles.card_img_box}>
        <img
          className={styles.card_img}
          src={poster}
          onClick={() => navigate(`/edit/recruiting/${recruitingId}`)}
          alt="리크루팅 이미지"
        />
      </div>
      <div className={styles.card_text_box}>
        <div
          className={styles.card_title}
          onClick={() => navigate(`/edit/recruiting/${recruitingId}`)}
        >
          {title || "리크루팅 제목 없음"}
        </div>
        <div className={styles.card_info_box}>
          <div className={styles.card_info}>
            <div className={styles.card_info_body}>{date || "날짜 없음"}</div>
          </div>
          <div className={styles.card_btn_box}>
            <div className={styles.card_btn_img_box}>
              <img
                className={styles.card_btn}
                src={showEditBtn}
                onClick={() => navigate(`/edit/recruiting/${recruitingId}`)}
                alt="리크루팅 수정"
              />
            </div>
            <div className={styles.card_btn_img_box}>
              {/* <img
                className={styles.card_btn}
                src={showDeleteBtn}
                onClick={() => navigate(`/delete/recruiting/${recruitingId}`)}
                alt="리크루팅 삭제"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default RecruitingCard;
