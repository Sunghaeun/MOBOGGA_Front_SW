import { useNavigate } from "react-router-dom";
import styles from "./styles/ReservManageCard.module.css";
import showHolderBtn from "../../assets/manager/show_holder_btn.svg";
import showEditBtn from "../../assets/manager/show_edit_btn.svg";
import showDeleteBtn from "../../assets/manager/show_delete_btn.svg";
import apiClient from "../../utils/apiClient";

function ReservManageCard({ data }) {
  const navigate = useNavigate();
  if (!data) return null;

  const { id, scheduleId, poster, title, order, applyPeople, maxPeople } =
    data;

  const handleHolderList = () => {
    navigate(`/manager/holder/${scheduleId}`);
  };

  const handleEditShow = () => {
    navigate(`/edit/show/${scheduleId}`);
  };

  const handleDeleteShow = async () => {
    if (
      !window.confirm(
        "정말로 이 공연을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      return;
    }

    // showId로 전체 공연(모든 스케줄 포함) 삭제
    const apiUrl = `/mypage/manager/show/${id}`;
    console.log("🔄 공연 삭제 API 요청:", apiUrl);
    console.log("삭제할 공연 정보:", { id, scheduleId, title });

    try {
      const response = await apiClient.delete(apiUrl);
      console.log("📡 응답 상태:", response.status);
      console.log("공연 삭제 성공:", response.data);

      alert("공연이 성공적으로 삭제되었습니다.");

      // 페이지 새로고침하여 목록 업데이트
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("공연 삭제 실패:", error);
      console.error("에러 상세:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response?.status === 401) {
        alert("권한이 없습니다. 다시 로그인해주세요.");
      } else if (error.response?.status === 403) {
        alert("이 공연을 삭제할 권한이 없습니다.");
      } else if (error.response?.status === 404) {
        alert("삭제할 공연을 찾을 수 없습니다.");
      } else {
        alert("공연 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
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
                onClick={() => handleEditShow()}
                alt="공연 수정"
              />
            </div>
            <div className={styles.card_btn_img_box}>
              <img
                className={styles.card_btn}
                src={showDeleteBtn}
                onClick={() => handleDeleteShow()}
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
