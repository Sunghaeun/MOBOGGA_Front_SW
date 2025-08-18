import React from "react";
import styles from "./ServerDownModal.module.css";

function ServerDownModal({ isOpen, onRetry, onClose, errorMessage }) {
  if (!isOpen) return null;

  // 기본 에러 메시지
  const defaultMessage = "서버에 연결할 수 없습니다.";
  const displayMessage = errorMessage || defaultMessage;

  // 이메일 도메인 에러인지 확인
  const isEmailDomainError =
    errorMessage?.includes("허용되지 않은 이메일 도메인") ||
    errorMessage?.includes("handong.ac.kr") ||
    errorMessage?.includes("handong.edu");

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {isEmailDomainError ? "로그인 오류" : "서버 연결 오류"}
          </h2>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.iconContainer}>
            <div className={styles.errorIcon}>
              {isEmailDomainError ? "🚫" : "⚠️"}
            </div>
          </div>

          <p className={styles.message}>{displayMessage}</p>

          <div className={styles.details}>
            {isEmailDomainError ? (
              <>
                <p>• handong.ac.kr 또는 handong.edu 이메일만 사용 가능합니다</p>
                <p>• 한동대학교 구글 계정으로 다시 로그인해주세요</p>
              </>
            ) : (
              <>
                <p>• 네트워크 연결을 확인해주세요</p>
                <p>• 잠시 후 다시 시도해주세요</p>
                <p>• 문제가 지속되면 관리자에게 문의해주세요</p>
              </>
            )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.retryButton} onClick={onRetry}>
            {isEmailDomainError ? "다시 로그인" : "다시 시도"}
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
