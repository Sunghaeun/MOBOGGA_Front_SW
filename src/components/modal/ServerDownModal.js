import React from "react";
import styles from "./ServerDownModal.module.css";

function ServerDownModal({ isOpen, onRetry, onClose, errorMessage }) {
  if (!isOpen) return null;

  // 기본 에러 메시지
  const defaultMessage = "서버에 연결할 수 없습니다.";

  // 원본 메시지 파싱: JSON 형태일 경우 error 또는 message 필드 사용
  let rawMessage = errorMessage;
  try {
    if (typeof errorMessage === "string") {
      const trimmed = errorMessage.trim();
      if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        const parsed = JSON.parse(trimmed);
        if (parsed && (parsed.error || parsed.message)) {
          rawMessage = parsed.error || parsed.message;
        }
      }
    } else if (typeof errorMessage === "object" && errorMessage !== null) {
      if (errorMessage.error || errorMessage.message) {
        rawMessage = errorMessage.error || errorMessage.message;
      }
    }
  } catch (e) {
    // 파싱 실패하면 원본 사용
    rawMessage = errorMessage;
  }

  // 메시지 정규화 (소문자화, 구두점 제거)
  const normalized = (rawMessage || "")
    .replace(/[.,!?()[\]{}"'·…]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  // 디버그 로그
  console.log("[ServerDownModal] rawMessage:", rawMessage);
  console.log("[ServerDownModal] normalized:", normalized);

  // 이메일 도메인 에러인지 확인
  const isEmailDomainError =
    normalized.includes("허용되지 않은 이메일 도메인") ||
    normalized.includes("handong.ac.kr") ||
    normalized.includes("handong.edu");

  // 잘못된 요청/인증 에러인지 확인
  const isBadRequestError =
    normalized.includes("잘못된 요청") ||
    normalized.includes("다시 로그인") ||
    normalized.includes("로그인 세션");

  // 사용자 친화적인 메시지로 변환 (백엔드 원문 우선)
  // 원문이 제공되면 우선 표시. 없을 경우 기본 메시지 사용
  const displayMessage = rawMessage || defaultMessage;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {isEmailDomainError
              ? "로그인 오류"
              : isBadRequestError
              ? "인증 오류"
              : "서버 연결 오류"}
          </h2>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.iconContainer}>
            <div className={styles.errorIcon}>
              {isEmailDomainError ? "🚫" : isBadRequestError ? "🔐" : "⚠️"}
            </div>
          </div>

          <p className={styles.message}>{displayMessage}</p>

          <div className={styles.details}>
            {isEmailDomainError ? (
              <>
                <p>• handong.ac.kr 또는 handong.edu 이메일만 사용 가능합니다</p>
                <p>• 한동대학교 구글 계정으로 다시 로그인해주세요</p>
              </>
            ) : isBadRequestError ? (
              <>
                <p>• 로그인 세션이 만료되었습니다</p>
                <p>• 다시 로그인하여 인증을 받아주세요</p>
                <p>• 문제가 지속되면 브라우저 캐시를 삭제해보세요</p>
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
            {isEmailDomainError || isBadRequestError
              ? "다시 로그인"
              : "다시 시도"}
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
