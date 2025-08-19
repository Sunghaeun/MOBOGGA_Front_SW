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
    // 부모 카드 클릭으로 상세 페이지로 가지 않도록 전파 차단
    e?.stopPropagation();
    navigate(`/edit/show/${showId}`);
  };

  const handleDeleteClick = async (e) => {
    e?.stopPropagation();

    if (isDeleting) return; // 다중 클릭 방지

    if (
      !window.confirm(
        "정말로 이 공연을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await apiClient.delete(`/mypage/manager/show/${showId}`);
      console.log("공연 삭제 성공", showId, response?.data);

      // 사용자에게 성공 안내
      try {
        alert("공연이 성공적으로 삭제되었습니다.");
      } catch (e) {
        /* alert가 차단될 경우 무시 */
      }

      // 부모가 onDeleted 콜백을 제공하면 우선 호출하여 부모에서 목록 갱신 처리
      if (typeof onDeleted === "function") {
        try {
          onDeleted(showId);
          return;
        } catch (cbErr) {
          console.error("onDeleted callback error:", cbErr);
          // 콜백 실패 시 폴백 동작 없음 — 경고만 로깅
        }
      }

      // 부모 콜백이 없으면 콘솔에 경고. 페이지 강제 이동/새로고침은 피함.
      if (typeof onDeleted !== "function") {
        console.warn(
          "onDeleted not provided — 삭제 후 화면 갱신을 부모에서 처리해주세요."
        );
      }
    } catch (error) {
      console.error("공연 삭제 실패:", error);
      // 서버에서 유의미한 메시지가 있으면 사용자에게 보여줌
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
                <img className={styles.card_btn} src={showDeleteBtn} alt="공연 삭제" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ShowManageCard;
