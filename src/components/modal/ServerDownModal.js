import React from "react";
import styles from "./ServerDownModal.module.css";

function ServerDownModal({ isOpen, onRetry, onClose }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>서버 연결 오류</h2>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.iconContainer}>
            <div className={styles.errorIcon}>⚠️</div>
          </div>

          <p className={styles.message}>서버에 연결할 수 없습니다.</p>

          <div className={styles.details}>
            <p>• 네트워크 연결을 확인해주세요</p>
            <p>• 잠시 후 다시 시도해주세요</p>
            <p>• 문제가 지속되면 관리자에게 문의해주세요</p>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.retryButton} onClick={onRetry}>
            다시 시도
          </button>
          <button className={styles.closeButton} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServerDownModal;
