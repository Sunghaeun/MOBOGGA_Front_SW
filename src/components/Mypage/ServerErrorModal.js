/* eslint-disable */
import { useState } from "react";
import styles from "./styles/LoginOverModal.module.css";
import Modal from "../Modal";

const ServerErrorModal = ({ isOpen, onClose, errorMessage }) => {
  const handleErrorConfirm = () => {
    console.log("서버 에러 모달 닫기");
    onClose();
  };

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
    // 파싱 실패하면 원본 문자열 사용
    rawMessage = errorMessage;
  }

  // 메시지 정규화 (소문자화, 구두점 제거)
  const normalized = (rawMessage || "")
    .replace(/[\.,!?()\[\]{}"'·…]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  // 디버그 로그: 실제 원문과 정규화된 문자열 확인
  console.log("[ServerErrorModal] rawMessage:", rawMessage);
  console.log("[ServerErrorModal] normalized:", normalized);

  const isEmailDomainError =
    normalized.includes("허용되지 않은 이메일 도메인") ||
    normalized.includes("handong.ac.kr") ||
    normalized.includes("handong.edu");

  const isAuthError =
    normalized.includes("잘못된 요청") ||
    normalized.includes("다시 로그인") ||
    normalized.includes("로그인 세션");

  // 우선적으로 백엔드에서 전달된 문구를 보여주고, 없을 경우 사용자 친화적 문구로 대체
  let displayMessage;
  if (isEmailDomainError && rawMessage) {
    displayMessage = rawMessage;
  } else if (isAuthError && rawMessage) {
    // 인증 관련이면 간단히 안내 문구로 대체
    displayMessage = "로그인 세션이 만료되었습니다. 다시 로그인해주세요.";
  } else {
    displayMessage =
      rawMessage ||
      "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하거나 관리자에게 문의해주세요.";
  }

  const title = isEmailDomainError
    ? "로그인 오류"
    : isAuthError
    ? "인증 오류"
    : "서버 연결 오류";

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className={styles.modal_content}>
          <div className={styles.modal_top}>{title}</div>
          <div className={styles.modal_con}>{displayMessage}</div>
          <div className={styles.modal_Btns}>
            <button
              onClick={handleErrorConfirm}
              className={styles.modal_ok_Btn}
            >
              확인
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ServerErrorModal;
