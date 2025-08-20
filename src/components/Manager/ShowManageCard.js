import { useNavigate } from "react-router-dom";
import styles from "./styles/ShowManageCard.module.css";
import showEditBtn from "../../assets/manager/show_edit_btn.svg";
import showDeleteBtn from "../../assets/manager/show_delete_btn.svg";
import apiClient from "../../utils/apiClient";
import { useState } from "react";

function ShowManageCard({ data, onDeleted }) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  if (!data) return null;

  const { showId, poster, title, date } = data;

  const handleCardClick = () => {
    navigate(`/edit/show/${showId}`);
  };

  const handleEditClick = (e) => {
    e?.stopPropagation();
    navigate(`/edit/show/${showId}`);
  };

  const handleDeleteClick = async (e) => {
    e?.stopPropagation();
    if (isDeleting) return;
    if (
      !window.confirm(
        "정말로 이 공연을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await apiClient.delete(`/mypage/manager/show/${showId}`);

      try {
        alert("공연이 성공적으로 삭제되었습니다.");
      } catch (e) {
        /* ignore */
      }

      if (typeof onDeleted === "function") {
        try {
          onDeleted(showId);
          return;
        } catch (cbErr) {
          // ignore
        }
      }
      // if no onDeleted, parent is expected to refresh
    } catch (error) {
      const userMsg =
        error?.response?.data?.message ||
        error?.message ||
        "공연 삭제 중 오류가 발생했습니다. 다시 시도해주세요.";
      try {
        alert(userMsg);
      } catch (e) {
        /* ignore */
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.card_img_box}>
        <img
          className={styles.card_img}
          src={poster}
          alt="공연 이미지"
          onClick={() => handleCardClick()}
        />
      </div>
      <div className={styles.card_text_box}>
        <div className={styles.card_title} onClick={() => handleCardClick()}>
          {title || "공연 제목 없음"}
        </div>
        <div className={styles.card_info_box}>
          <div className={styles.card_info} id={styles.order_box}>
            <div className={styles.card_date}>{date || "날짜 정보 없음"}</div>
          </div>
          <div className={styles.card_btn_box}>
            <div className={styles.card_btn_img_box}>
              <button
                type="button"
                className={styles.card_btn}
                onClick={(e) => handleEditClick(e)}
                aria-label="공연 수정"
                disabled={isDeleting}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                }}
              >
                <img src={showEditBtn} alt="공연 수정" />
              </button>
            </div>
            <div className={styles.card_btn_img_box}>
              <button
                type="button"
                className={styles.card_btn}
                onClick={(e) => handleDeleteClick(e)}
                aria-label="공연 삭제"
                disabled={isDeleting}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                }}
              >
                <img
                  className={styles.card_btn}
                  src={showDeleteBtn}
                  alt="공연 삭제"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowManageCard;
