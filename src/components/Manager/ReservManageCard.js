import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./styles/ReservManageCard.module.css";
import showHolderBtn from "../../assets/manager/show_holder_btn.svg";
import showDeleteBtn from "../../assets/manager/show_delete_btn.svg";
import apiClient from "../../utils/apiClient";
import Modal from "../Modal";

function ReservManageCard({ data, onDeleted }) {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!data) return null;

  const { id, scheduleId, poster, title, order, applyPeople, maxPeople } = data;

  const handleHolderList = () => {
    navigate(`/manager/holder/${scheduleId}`);
  };

  const handleDeleteShow = async () => {
    // showId로 전체 공연(모든 스케줄 포함) 삭제
    const apiUrl = `/mypage/manager/show/${id}`;

    try {
      await apiClient.delete(apiUrl);

      alert("공연이 성공적으로 삭제되었습니다.");

      // 부모 콜백이 제공되면 부모에서 목록 갱신을 수행하도록 유도
      // (부모가 onDeleted를 제공하지 않으면 콘솔에 경고만 남김)
      if (typeof onDeleted === "function") {
        try {
          onDeleted(id);
          return;
        } catch (cbErr) {}
      } else {
        // onDeleted not provided — nothing to call
      }
    } catch (error) {
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

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = () => {
    setIsDeleteModalOpen(false);
    handleDeleteShow();
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
            <div className={styles.card_order}>
              {order || "공연 정보 없음"}공
            </div>
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
                src={showDeleteBtn}
                onClick={openDeleteModal}
                alt="공연 삭제"
              />
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <div className={styles.modal_content}>
          <div className={styles.modal_top}>
            정말로 이 공연을 삭제하시겠습니까?
          </div>
          <div className={styles.modal_con}>이 작업은 되돌릴 수 없습니다.</div>
          <div className={styles.modal_Btns}>
            <button
              onClick={closeDeleteModal}
              className={styles.modal_close_Btn}
            >
              취소
            </button>
            <button onClick={confirmDelete} className={styles.modal_ok_Btn}>
              삭제
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default ReservManageCard;
