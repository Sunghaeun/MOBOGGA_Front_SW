/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import styles from "./styles/CreateRecruiting.module.css";
import insta from "../assets/icons/instagram.svg";
import kakao from "../assets/icons/kakao.svg";
import youtube from "../assets/icons/youtube.svg";
import link from "../assets/icons/linkicons.svg";
import defaultImg from "../assets/defaultImg.jpg";

import NotEnteredModal from "../components/modal/NotEnteredModal";
import EditCheckModal from "../components/modal/EditCheckModal";
import PageOut from "../components/modal/PageOut";

import CategoryDropdown from "../components/CategoryDropdown";

import useAuthStore from "../stores/authStore";
import apiClient from "../utils/apiClient";

function CreateRecruiting() {
// ===== Zustand 인증 정보 =====
  const { isLoggedIn, isManager, user, token } = useAuthStore();


// 필수 입력 필드 목록
  const REQUIRED_FIELDS = [
    { key: "name", label: "제목" },
    { key: "category", label: "카테고리" },
    { key: "startDate", label: "모집 시작" },
    { key: "endDate", label: "모집 종료" },
    { key: "mandatorySemesters", label: "필수학기" },
    { key: "meetingTime", label: "정모시간" },
    { key: "content", label: "활동내용" },
    { key: "eligibility", label: "지원자격" },
    { key: "notice", label: "면접안내" },
    { key: "manager", label: "문의 이름" },
    { key: "managerPhoneNumber", label: "문의 연락처" },
    { key: "applicationUrl", label: "지원링크" },  
    { key: "introductionLetter", label: "소개글" },
  ];

// 미입력 필드 추적 (error 스타일용)
  const [missing, setMissing] = useState(new Set());

  // ===== 모달 상태 =====
  const [notEnteredModalOpen, setNotEnteredModalOpen] = useState(false);
  const openNotEnteredModal = () => setNotEnteredModalOpen(true);
  const closeNotEnteredModal = () => {
    setNotEnteredModalOpen(false);
    document.body.style.removeProperty("overflow");
  };

  const [editCheckModalOpen, setEditCheckModalOpen] = useState(false);
  const openEditCheckModal = () => setEditCheckModalOpen(true);
  const closeEditCheckModal = () => {
    setEditCheckModalOpen(false);
    document.body.style.removeProperty("overflow");
  };

  const [pageOutModalOpen, setPageOutModalOpen] = useState(false);
  const openPageOutModal = () => setPageOutModalOpen(true);
  const closePageOutModal = () => {
    setPageOutModalOpen(false);
    document.body.style.removeProperty("overflow");
  };

  // ===== 폼 데이터 =====
  const [data, setData] = useState({
    name: "",
    category: "",
    startDate: "",
    endDate: "",
    mandatorySemesters: "",
    meetingTime: "",
    content: "",
    eligibility: "",
    notice: "",
    manager: "",
    managerPhoneNumber: "",
    introductionLetter: "",
    inUrl: "",
    kakaUrl: "",
    youUrl: "",
    url: "",
    applicationUrl: "",
    photo: defaultImg, // 미리보기 URL (서버 전송 X)
  });

// 공통 인풋 핸들러
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setMissing((prev) => {
      if (!prev.has(name)) return prev;
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
  };

// 유효성 검사
  const validateRequired = () => {
    const newMissing = new Set();
    REQUIRED_FIELDS.forEach(({ key }) => {
      const v = (data[key] ?? "").toString().trim();
      if (!v) newMissing.add(key);
    });
    setMissing(newMissing);
    return newMissing;
  };

  // ===== 이미지 업로드 & 미리보기 =====
  const [photoFile, setPhotoFile] = useState(null);
  const [posterReady, setPosterReady] = useState(false);
  const fileInputRef = useRef(null);
  const fieldRefs = useRef({}); // 각 input ref 저장

  const setFieldRef = (name) => (el) => {
    if (el) fieldRefs.current[name] = el;
  };

  const handleFileButtonClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    setPhotoFile(f);
    if (f) {
      const preview = URL.createObjectURL(f);
      setData((prev) => ({ ...prev, photo: preview }));
    } else {
      setData((prev) => ({ ...prev, photo: defaultImg })); // 선택 취소 시 기본 프리뷰로
    }
  };

  // blob URL 정리
  useEffect(() => {
    return () => {
      if (data.photo?.startsWith("blob:")) URL.revokeObjectURL(data.photo);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoFile]);

  // ===== 생성 요청 =====
  const handleSubmit = async () => {
    if (!isLoggedIn || !isManager()) {
      alert("로그인이 필요하거나 매니저 권한이 없습니다.");
      return;
    }

    const notFilled = validateRequired();
    if (notFilled.size > 0) {
      // 첫 번째 미입력 필드로 이동 + 모달 오픈
      const firstKey = [...notFilled][0];
      const el = fieldRefs.current[firstKey];
      if (el?.focus) el.focus();
      if (el?.scrollIntoView) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      openNotEnteredModal();
      return;
    }

    try {
      const { photo, ...requestDto } = data;

      const formData = new FormData();
      formData.append(
        "request",
        new Blob([JSON.stringify(requestDto)], { type: "application/json" })
      );
      if (photoFile) formData.append("poster", photoFile);

      const res = await apiClient.post("/manager/recruiting/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      console.log("리크루팅 생성 성공:", res?.data);
      // 필요 시 초기화/이동
    } catch (err) {
      console.error("리크루팅 생성 실패", err);
      alert("리크루팅 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const requestSubmit = () => {
    if (!isLoggedIn || !isManager()) {
      alert("로그인이 필요하거나 매니저 권한이 없습니다.");
      return;
    }

    const notFilled = validateRequired();
    if (notFilled.size > 0) {
      const firstKey = [...notFilled][0];
      const el = fieldRefs.current[firstKey];
      el?.focus?.();
      el?.scrollIntoView?.({ behavior: "smooth", block: "center" });
      openNotEnteredModal();
      return;
    }

    // 모든 필수값 OK → 확인 모달 오픈
    openEditCheckModal();
  };

  // 모달에서 확인을 누를 때 실행
  const confirmSubmit = async () => {
    closeEditCheckModal();
    await handleSubmit(); // 기존 로직 그대로 사용
  };


  return (
    <>
      <div className={styles.main}>
        <div className={styles.title}>
          <span>리크루팅 새로 만들기</span>
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.leftInput}>
            <div className={styles.photoInput}>
              <img src={data.photo} alt={data.name} className={styles.recruitinImg} />
            </div>
            <div className={styles.photobutton} onClick={handleFileButtonClick}>
              <span>이미지 추가</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          <div className={styles.rightInput}>
            <span className={styles.announcement}>
              *관련 링크 외 모든 정보는 필수입력사항입니다
            </span>

            {/* 제목 */}
            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>제목</span><span className={styles.required}>*</span>
              </div>
              <input
                ref={setFieldRef("name")}
                type="text"
                name="name"
                className={missing.has("name") ? styles.invalid : ""}
                placeholder="리크루팅 제목 (공백 포함 최대 30자)"
                value={data.name}
                onChange={onChangeInput}
              />
            </div>

            {/* 카테고리 */}
            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>카테고리</span><span className={styles.required}>*</span>
              </div>
                <div className="dropdown">
                  <CategoryDropdown
                    ref={setFieldRef("category")}
                    name="category"
                    value={data.category}
                    onChange={onChangeInput}
                    defaultValue="카테고리"
                    options={["정기모집", "상시모집", "추가모집"]} 
                    className={missing.has("category") ? styles.invalid : ""}
                  />
                </div>
            </div>

            {/* 모집기간 */}
            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>모집기간</span><span className={styles.required}>*</span>
              </div>
              <div className={styles.dateInput}>
                <input
                  ref={setFieldRef("startDate")}
                  className={`${styles.dateInput_1} ${missing.has("startDate") ? styles.invalid : ""}`}
                  type="date"
                  name="startDate"
                  value={data.startDate}
                  onChange={onChangeInput}
                />
                <span>~</span>
                <input
                  ref={setFieldRef("endDate")}
                  className={`${styles.dateInput_1} ${missing.has("endDate") ? styles.invalid : ""}`}
                  type="date"
                  name="endDate"
                  value={data.endDate}
                  onChange={onChangeInput}
                />
              </div>
            </div>

            {/* 필수학기 */}
            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>필수학기</span><span className={styles.required}>*</span>
              </div>
              <input
                ref={setFieldRef("mandatorySemesters")}
                type="number"
                name="mandatorySemesters"
                className={missing.has("mandatorySemesters") ? styles.invalid : ""}
                placeholder="필수학기(숫자만 입력 가능합니다. 없으면 '0')"
                value={data.mandatorySemesters}
                onChange={onChangeInput}
              />
            </div>

            {/* 정모시간 */}
            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>정모시간</span><span className={styles.required}>*</span>
              </div>
              <input
                ref={setFieldRef("meetingTime")}
                type="text"
                name="meetingTime"
                className={missing.has("meetingTime") ? styles.invalid : ""}
                placeholder="정모시간(없으면 '없음')"
                value={data.meetingTime}
                onChange={onChangeInput}
              />
            </div>

            {/* 활동내용 */}
            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>활동내용</span><span className={styles.required}>*</span>
              </div>
              <textarea
                ref={setFieldRef("content")}
                name="content"
                rows={4}
                className={`${styles.textarea} ${missing.has("content") ? styles.invalid : ""}`}
                placeholder="주요 활동, 모집 분야 등 100자 내"
                value={data.content}
                onChange={onChangeInput}
              />
            </div>

            {/* 지원자격 */}
            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>지원자격</span><span className={styles.required}>*</span>
              </div>
              <textarea
                ref={setFieldRef("eligibility")}
                name="eligibility"
                rows={4}
                className={`${styles.textarea} ${missing.has("eligibility") ? styles.invalid : ""}`}
                placeholder="모집대상 및 지원자격 200자 내"
                value={data.eligibility}
                onChange={onChangeInput}
              />
            </div>

            {/* 면접안내 */}
            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>면접안내</span><span className={styles.required}>*</span>
              </div>
              <textarea
                ref={setFieldRef("notice")}
                name="notice"
                rows={4}
                className={`${styles.textarea} ${missing.has("notice") ? styles.invalid : ""}`}
                placeholder="면접 일정/장소/내용 200자 내"
                value={data.notice}
                onChange={onChangeInput}
              />
            </div>

            {/* 문의 */}
            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>문의</span><span className={styles.required}>*</span>
              </div>
              <input
                ref={setFieldRef("manager")}
                className={`${styles.miniInput} ${missing.has("manager") ? styles.invalid : ""}`}
                type="text"
                name="manager"
                placeholder="이름"
                value={data.manager}
                onChange={onChangeInput}
              />
              <input
                ref={setFieldRef("managerPhoneNumber")}
                className={missing.has("managerPhoneNumber") ? styles.invalid : ""}
                type="text"
                name="managerPhoneNumber"
                placeholder="연락처(전화번호 혹은 메일)"
                value={data.managerPhoneNumber}
                onChange={onChangeInput}
              />
            </div>

            {/* 지원링크 */}
            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>지원링크</span><span className={styles.required}>*</span>
              </div>
              <input
                ref={setFieldRef("applicationUrl")}
                type="text"
                name="applicationUrl"
                className={missing.has("applicationUrl") ? styles.invalid : ""}
                placeholder="Google Forms, Walla 등 리크루팅 링크"
                value={data.applicationUrl}
                onChange={onChangeInput}
              />
            </div>

            {/* 관련링크 (선택) */}
            <div className={styles.row}>
              <div className={styles.inputTitle}><span>관련링크</span></div>
              <div className={styles.linkContainer}>
                <div className={styles.linkrow}>
                  <img src={insta} alt="Instagram" />
                  <input
                    type="text" name="inUrl" placeholder="인스타그램 링크 입력"
                    value={data.inUrl} onChange={onChangeInput}
                  />
                </div>
                <div className={styles.linkrow1}>
                  <img src={kakao} alt="KakaoTalk" />
                  <input
                    type="text" name="kakaUrl" placeholder="카카오톡 링크 입력"
                    value={data.kakaUrl} onChange={onChangeInput}
                  />
                </div>
                <div className={styles.linkrow1}>
                  <img src={youtube} alt="YouTube" />
                  <input
                    type="text" name="youUrl" placeholder="유튜브 링크 입력"
                    value={data.youUrl} onChange={onChangeInput}
                  />
                </div>
                <div className={styles.linkrow1}>
                  <img src={link} alt="Link" />
                  <input
                    type="text" name="url" placeholder="링크 입력"
                    value={data.url} onChange={onChangeInput}
                  />
                </div>
              </div>
            </div>

            {/* 소개글 */}
            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>소개글</span><span className={styles.required}>*</span>
              </div>
              <textarea
                ref={setFieldRef("introductionLetter")}
                name="introductionLetter"
                rows={4}
                className={`${styles.textarea} ${missing.has("introductionLetter") ? styles.invalid : ""}`}
                placeholder={`리크루팅에 대한 간략한 소개\n(공백 포함 최대 300자)`}
                value={data.introductionLetter}
                onChange={onChangeInput}
              />
            </div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <div className={styles.createClub} onClick={requestSubmit}>
            <span>리크루팅 만들기</span>
          </div>
        </div>
      </div>

      <NotEnteredModal open={notEnteredModalOpen} close={closeNotEnteredModal} />
      <EditCheckModal open={editCheckModalOpen} close={closeEditCheckModal} onConfirm={confirmSubmit}/>
      <PageOut open={pageOutModalOpen} close={closePageOutModal} />
    </>
  );
}

export default CreateRecruiting;
