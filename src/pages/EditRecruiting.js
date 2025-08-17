/* eslint-disable */
// 사진 아무것도 선택하지 않았을 때
// 사진을 선택하지 않았을 때는 기존 사진을 유지하고 있음 잘하는건가??

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import styles from "./styles/CreateRecruiting.module.css";

import insta from "../assets/icons/instagram.svg";
import kakao from "../assets/icons/kakao.svg";
import youtube from "../assets/icons/youtube.svg";
import link from "../assets/icons/linkicons.svg";

import NotEnteredModal from "../components/modal/NotEnteredModal";
import EditCheckModal from "../components/modal/EditCheckModal";
import PageOut from "../components/modal/PageOut";

function CreateRecruiting() {
  // URL 파라미터에서 recruitingId 가져오기
  const { recruitingId } = useParams();

  // 1) 누락된 정보 확인 모달
  const [notEnteredModalOpen, setNotEnteredModalOpen] = useState(false);
  const openNotEnteredModal = () => setNotEnteredModalOpen(true);
  const closeNotEnteredModal = () => {
    setNotEnteredModalOpen(false);
    document.body.style.removeProperty("overflow");
  };

  // 2) 리쿠르팅 생성 확인 모달
  const [editCheckModalOpen, setEditCheckModalOpen] = useState(false);
  const openEditCheckModal = () => setEditCheckModalOpen(true);
  const closeEditCheckModal = () => {
    setEditCheckModalOpen(false);
    document.body.style.removeProperty("overflow");
  };

  // 3) 페이지 나가기 모달
  const [pageOutModalOpen, setPageOutModalOpen] = useState(false);
  const openPageOutModal = () => setPageOutModalOpen(true);
  const closePageOutModal = () => {
    setPageOutModalOpen(false);
    document.body.style.removeProperty("overflow");
  };

  // 4) 저장할 데이터 배열에 미리 저장해두기
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
    noUrl: "",
    url: "",
    applyUrl: "",
    photo: null,
  });

  // 일반 필드 변경

  // 5) 리쿠르팅 정보 가져오기
  const getRecruiting = async () => {
    try {
      const token = window.tempToken;

      // 요청 설정 준비
      const requestConfig = {
        withCredentials: true,
      };

      if (!document.cookie.includes("session") && token) {
        requestConfig.headers = {
          Authorization: `Bearer ${token}`,
        };
      }

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/manager/recruiting/update/${recruitingId}`,
        requestConfig
      );
      const src = res.data ?? {};
      console.log("리쿠르팅 데이터 로드 성공", src);
      const converted = {
        name: src.name ?? "",
        category: src.category ?? "",
        startDate: src.startDate ?? "",
        endDate: src.endDate ?? "",
        mandatorySemesters:
          src.mandatorySemesters != null ? String(src.mandatorySemesters) : "",
        meetingTime: src.meetingTime ?? "",
        content: src.content ?? "",
        eligibility: src.eligibility ?? "",
        notice: src.notice ?? "",
        manager: src.manager ?? "",
        managerPhoneNumber: src.managerPhoneNumber ?? "",
        introductionLetter: src.introductionLetter ?? "",
        inUrl: src.inUrl ?? "",
        kakaUrl: src.kakaUrl ?? "",
        youUrl: src.youUrl ?? "",
        noUrl: src.noUrl ?? "",
        url: src.url ?? "",
        applyUrl: src.applyUrl ?? "",
        photo: src.photo ?? null,
      };

      setData((prev) => ({ ...prev, ...converted }));
    } catch (err) {
      console.error("리쿠르팅 데이터 로드 실패", err);
    }
  };

  // 6) 리쿠르팅 정보 불러오기

  useEffect(() => {
    getRecruiting();
  }, [recruitingId]);

  // 7) 리쿠르팅 수정 put 요청
  const handleSubmit = async () => {
    try {
      const token = window.tempToken;
      const url = `${process.env.REACT_APP_API_URL}/manager/recruiting/update/${recruitingId}`;

      // photo는 미리보기 전용이므로 서버 전송용 request에서는 제외
      const { photo, ...requestDto } = data;

      const formData = new FormData();
      formData.append(
        "request",
        new Blob([JSON.stringify(requestDto)], { type: "application/json" })
      );
      if (photoFile) {
        formData.append("poster", photoFile); // 원본 파일 그대로 전송
      }

      await axios.put(url, formData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      alert("리쿠르팅 수정 완료"); //이제 이게 모달이 되어야겠지?

      // 수정 후 최신 데이터 재조회
      await getRecruiting();
    } catch (err) {
      console.error("리쿠르팅 수정 실패", err);
      alert("요청 중 오류가 발생했습니다.");
    }
  };

  // 8) 이미지 업로드
  const [photoFile, setPhotoFile] = useState(null);
  const fileInputRef = useRef(null);

  const onChangeInput = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileButtonClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    setPhotoFile(f);
    if (f) {
      const preview = URL.createObjectURL(f);
      setData((prev) => ({ ...prev, photo: preview }));
    }
  };

  useEffect(() => {
    return () => {
      if (data.photo?.startsWith("blob:")) {
        URL.revokeObjectURL(data.photo);
      }
    };
  }, [photoFile]);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.title}>
          <span>리쿠르팅 수정하기</span>
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.leftInput}>
            <div className={styles.photoInput}>
              <img
                src={data.photo}
                alt={data.name}
                className={styles.recruitinImg}
              />
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
                <span>제목</span>
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
                placeholder="리크루팅 제목 (공백 포함 최대 30자까지 작성 가능합니다.)"
                value={data.category}
                onChange={onChangeInput}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>모집기간</span>
                <span className={styles.required}>*</span>
              </div>
              <input
                type="text" /* 필요시 date 두 개로 분리 */
                name="startDate"
                placeholder="리크루팅 제목 (공백 포함 최대 30자까지 작성 가능합니다.)"
                value={data.startDate}
                onChange={onChangeInput}
              />
              {/* endDate 필드를 쓰려면 아래도 노출 */}
              {/* <input
                type="text"
                name="endDate"
                placeholder="종료일"
                value={data.endDate}
                onChange={onChangeInput}
              /> */}
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>필수학기</span>
                <span className={styles.required}>*</span>
              </div>
              <input
                type="text"
                name="mandatorySemesters"
                placeholder="필수학기(없는 경우, “없음”이라고 입력해주세요.)"
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
                placeholder="정모시간(없는 경우, “없음”이라고 입력해주세요.)"
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
                placeholder={`활동내용(주요 활동, 모집 분야 등 100자 내로 간략하게 작성해주세요.`}
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
                placeholder={`지원자격(모집대상 및 지원자격을 200자 내로 작성해주세요.)`}
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
                placeholder={`면접안내(면접 일정, 장소, 내용 등 200자 내로 작성해주세요.)`}
                value={data.notice}
                onChange={onChangeInput}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>문의</span>
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
                name="applyUrl"
                placeholder="Goolge forms, Walla 등 리크루팅 링크 입력"
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
            <span>리쿠르팅 수정하기</span>
          </div>
        </div>
      </div>

      <NotEnteredModal
        open={notEnteredModalOpen}
        close={closeNotEnteredModal}
      />
      <EditCheckModal open={editCheckModalOpen} close={closeEditCheckModal} />
      <PageOut open={pageOutModalOpen} close={closePageOutModal} />
    </>
  );
}

export default CreateRecruiting;
