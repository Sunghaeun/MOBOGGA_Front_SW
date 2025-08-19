/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import styles from "./styles/CreateRecruiting.module.css";
import insta from "../assets/icons/instagram.svg";
import kakao from "../assets/icons/kakao.svg";
import youtube from "../assets/icons/youtube.svg";
import link from "../assets/icons/linkicons.svg";

import NotEnteredModal from "../components/modal/NotEnteredModal";
import EditCheckModal from "../components/modal/EditCheckModal";
import PageOut from "../components/modal/PageOut";

import useAuthStore from "../stores/authStore";
import apiClient from "../utils/apiClient";

function CreateRecruiting() {
  // ===== Zustand 인증 정보 =====
  const { isLoggedIn, isManager, user, token } = useAuthStore();

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
    photo: "", // 미리보기 URL (서버 전송 X)
  });

  // 공통 인풋 핸들러
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // ===== 이미지 업로드 & 미리보기 =====
  const [photoFile, setPhotoFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileButtonClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    setPhotoFile(f);
    if (f) {
      const preview = URL.createObjectURL(f);
      setData((prev) => ({ ...prev, photo: preview }));
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

    try {
      // photo는 미리보기 전용 → requestDto에서는 제외
      const { photo, ...requestDto } = data;

      const formData = new FormData();
      formData.append(
        "request",
        new Blob([JSON.stringify(requestDto)], { type: "application/json" })
      );
      if (photoFile) {
        formData.append("poster", photoFile); // 서버가 기대하는 필드명에 맞춤
      }

      // 디버깅 로그 (선택)
      console.log("== 생성 요청 JSON ==", JSON.stringify(requestDto, null, 2));
      for (const [k, v] of formData.entries()) {
        if (v instanceof File) {
          console.log(k, "-> File", { name: v.name, size: v.size, type: v.type });
        } else if (k === "request" && v instanceof Blob) {
          v.text().then((t) => console.log("request(json) ->", t));
        } else {
          console.log(k, "->", v);
        }
      }

      const res = await apiClient.post(
        "/manager/recruiting/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // apiClient에서 토큰을 자동 부착하도록 설정되어 있다면 아래는 불필요.
            // 필요 시 주석 해제:
            // Authorization: token ? `Bearer ${token}` : undefined,
          },
          withCredentials: true, // (백엔드가 쿠키/세션 병용 시)
        }
      );

      console.log("리크루팅 생성 성공:", res?.data);
      alert("리크루팅 생성 완료");
      // TODO: 생성 후 페이지 이동/초기화 등 필요 시 추가
    } catch (err) {
      console.error("리크루팅 생성 실패", err);
      console.error("에러 상세:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
      });

      if (err.response?.status === 401) {
        alert("권한이 없습니다. 다시 로그인해주세요.");
      } else if (err.response?.status === 403) {
        alert("리크루팅 생성 권한이 없습니다.");
      } else {
        alert("리크루팅 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
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

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span >제목</span>
                <span className={styles.required}>*</span>
              </div>
              <input
                type="text"
                name="name"
                placeholder="리크루팅 제목 (공백 포함 최대 30자까지 작성 가능합니다.)"
                value={data.name}
                onChange={onChangeInput}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>카테고리</span>
                <span className={styles.required}>*</span>
              </div>
              <input
                type="text"
                name="category"
                placeholder="카테고리"
                value={data.category}
                onChange={onChangeInput}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>모집기간</span>
                <span className={styles.required}>*</span>
              </div>
              <div className={styles.dateInput}>
                <input
                  className={styles.dateInput_1}
                  type="date"
                  name="startDate"
                  value={data.startDate}
                  onChange={onChangeInput}
                />
                <span>~</span>
                <input
                  className={styles.dateInput_1}
                  type="date"
                  name="endDate"
                  value={data.endDate}
                  onChange={onChangeInput}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>필수학기</span>
                <span className={styles.required}>*</span>
              </div>
              <input
                type="text"
                name="mandatorySemesters"
                placeholder="필수학기(없으면 '없음')"
                value={data.mandatorySemesters}
                onChange={onChangeInput}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>정모시간</span>
                <span className={styles.required}>*</span>
              </div>
              <input
                type="text"
                name="meetingTime"
                placeholder="정모시간(없으면 '없음')"
                value={data.meetingTime}
                onChange={onChangeInput}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>활동내용</span>
                <span className={styles.required}>*</span>
              </div>
              <textarea
                name="content"
                rows={4}
                className={styles.textarea}
                placeholder={`활동내용(주요 활동, 모집 분야 등 100자 내로 간략하게 작성해주세요.)`}
                value={data.content}
                onChange={onChangeInput}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>지원자격</span>
                <span className={styles.required}>*</span>
              </div>
              <textarea
                name="eligibility"
                rows={4}
                className={styles.textarea}
                placeholder={`지원자격(모집대상 및 지원자격 200자 이내)`}
                value={data.eligibility}
                onChange={onChangeInput}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>면접안내</span>
                <span className={styles.required}>*</span>
              </div>
              <textarea
                name="notice"
                rows={4}
                className={styles.textarea}
                placeholder={`면접 일정/장소/내용 200자 이내`}
                value={data.notice}
                onChange={onChangeInput}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>문의 </span>
                <span className={styles.required}>*</span>
              </div>
              <input
                className={styles.miniInput}
                type="text"
                name="manager"
                placeholder="이름"
                value={data.manager}
                onChange={onChangeInput}
              />
              <input
                type="text"
                name="managerPhoneNumber"
                placeholder="연락처(전화번호 혹은 메일)"
                value={data.managerPhoneNumber}
                onChange={onChangeInput}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>지원링크</span>
                <span className={styles.required}>*</span>
              </div>
              <input
                type="text"
                name="applicationUrl"
                placeholder="Google Forms, Walla 등 리크루팅 링크"
                value={data.applyUrl}
                onChange={onChangeInput}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>관련링크</span>
              </div>
              <div className={styles.linkContainer}>
                <div className={styles.linkrow}>
                  <img src={insta} alt="Instagram" />
                  <input
                    type="text"
                    name="inUrl"
                    placeholder="인스타그램 링크 입력"
                    value={data.inUrl}
                    onChange={onChangeInput}
                  />
                </div>
                <div className={styles.linkrow1}>
                  <img src={kakao} alt="KakaoTalk" />
                  <input
                    type="text"
                    name="kakaUrl"
                    placeholder="카카오톡 링크 입력"
                    value={data.kakaUrl}
                    onChange={onChangeInput}
                  />
                </div>
                <div className={styles.linkrow1}>
                  <img src={youtube} alt="YouTube" />
                  <input
                    type="text"
                    name="youUrl"
                    placeholder="유튜브 링크 입력"
                    value={data.youUrl}
                    onChange={onChangeInput}
                  />
                </div>
                <div className={styles.linkrow1}>
                  <img src={link} alt="Link" />
                  <input
                    type="text"
                    name="url"
                    placeholder="링크 입력"
                    value={data.url}
                    onChange={onChangeInput}
                  />
                </div>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>소개글</span>
                <span className={styles.required}>*</span>
              </div>
              <textarea
                name="introductionLetter"
                rows={4}
                className={styles.textarea}
                placeholder={`리크루팅에 대한 간략한 소개\n(공백 포함 최대 300자까지 작성 가능합니다.)`}
                value={data.introductionLetter}
                onChange={onChangeInput}
              />
            </div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <div className={styles.createClub} onClick={handleSubmit}>
            <span>리크루팅 만들기</span>
          </div>
        </div>
      </div>

      <NotEnteredModal open={notEnteredModalOpen} close={closeNotEnteredModal} />
      <EditCheckModal open={editCheckModalOpen} close={closeEditCheckModal} />
      <PageOut open={pageOutModalOpen} close={closePageOutModal} />
    </>
  );
}

export default CreateRecruiting;
