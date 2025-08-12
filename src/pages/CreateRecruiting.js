import React, { useState } from "react";

import styles from "./styles/CreateRecruiting.module.css";

import insta from "../assets/icons/snsicons.svg";
import kakao from "../assets/icons/kakao.svg";
import youtube from "../assets/icons/youtubeicons.svg";
import link from "../assets/icons/linkicons.svg";

import NotEnteredModal from "../components/modal/NotEnteredModal";
import EditCheckModal from "../components/modal/EditCheckModal";
import PageOut from "../components/modal/PageOut";


function CreateRecruiting() {

  // 1) 누락된 정보 확인 모달
  const [notEnteredModalOpen, setNotEnteredModalOpen] = useState(false);
  const openNotEnteredModal = () => setNotEnteredModalOpen(true);
  const closeNotEnteredModal = () => {
    setNotEnteredModalOpen(false);
    document.body.style.removeProperty('overflow');
  };

  // 2) 리쿠르팅 생성 확인 모달
  const [editCheckModalOpen, setEditCheckModalOpen] = useState(false);
  const openEditCheckModal = () => setEditCheckModalOpen(true);
  const closeEditCheckModal = () => {
    setEditCheckModalOpen(false);
    document.body.style.removeProperty('overflow');
  };

  // 3) 페이지 나가기 모달
  const [pageOutModalOpen, setPageOutModalOpen] = useState(false);
  const openPageOutModal = () => setPageOutModalOpen(true);
  const closePageOutModal = () => {
    setPageOutModalOpen(false);
    document.body.style.removeProperty('overflow');
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
      photo: "",
  });

  // 일반 필드 변경
  const onChangeInput = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  
  return (
    <>
      <div className={styles.main}>
        <div className={styles.title}>
          <span>리쿠르팅 새로 만들기</span>
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.leftInput}>
            <div className={styles.photoInput}>
            
            </div>
            <div className={styles.photobutton}>
              <span>이미지 추가</span>
            </div>
          </div>

          <div className={styles.rightInput}>
            <span className={styles.announcement} onClick={() => openNotEnteredModal()}>
              *관련 링크 외 모든 정보는 필수입력사항입니다
            </span>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span onClick={() => openEditCheckModal()}>제목</span>
                <span className={styles.required}>*</span>
              </div>
              <input placeholder="리크루팅 제목 (공백 포함 최대 30자까지 작성 가능합니다.)" type="text" onChange={onChangeInput}></input>
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span onClick={() => openPageOutModal()}>카테고리</span>
                <span className={styles.required}>*</span>
              </div>
              <input placeholder="리크루팅 제목 (공백 포함 최대 30자까지 작성 가능합니다.)" type="text" onChange={onChangeInput}></input>
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>모집기간</span>
                <span className={styles.required}>*</span>
              </div>
              <input placeholder="리크루팅 제목 (공백 포함 최대 30자까지 작성 가능합니다.)" type="text" onChange={onChangeInput}></input>
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>필수학기</span>
                <span className={styles.required}>*</span>
              </div>
              <input placeholder="필수학기(없는 경우, “없음”이라고 입력해주세요.)" type="text" onChange={onChangeInput}></input>
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>정모시간</span>
                <span className={styles.required}>*</span>
              </div>
              <input placeholder="정모시간(없는 경우, “없음”이라고 입력해주세요.)" type="text" onChange={onChangeInput}></input>
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>활동내용</span>
                <span className={styles.required}>*</span>
              </div>
              <textarea
                placeholder={`활동내용(주요 활동, 모집 분야 등 100자 내로 간략하게 작성해주세요.`}
                className={styles.textarea}
                rows={4}
                onChange={onChangeInput}
              ></textarea>
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>지원자격</span>
                <span className={styles.required}>*</span>
              </div>
              <textarea
                placeholder={`지원자격(모집대상 및 지원자격을 200자 내로 작성해주세요.)`}
                className={styles.textarea}
                rows={4}
                onChange={onChangeInput}
              ></textarea>
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>면접안내</span>
                <span className={styles.required}>*</span>
              </div>
              <textarea
                placeholder={`면접안내(면접 일정, 장소, 내용 등 200자 내로 작성해주세요.)`}
                className={styles.textarea}
                rows={4}
                onChange={onChangeInput}
              ></textarea>
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>문의    </span>
                <span className={styles.required}>*</span>
              </div>
              <input placeholder="이름" type="text" className={styles.miniInput} onChange={onChangeInput}></input>
              <input placeholder="연락처(전화번호 혹은 메일)" type="text" onChange={onChangeInput}></input>
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>지원링크</span>
                <span className={styles.required}>*</span>
              </div>
              <input placeholder="Goolge forms, Walla 등 리크루팅 링크 입력" type="text" onChange={onChangeInput}></input>
            </div>

            <div className={styles.row}>
              <div className={styles.inputTitle}>
                <span>관련링크</span>
              </div>
              <div className={styles.linkContainer}>
                <div className={styles.linkrow}>
                  <img src={insta} alt="Instagram" />
                  <input placeholder="인스타그램 링크 입력" type="text" onChange={onChangeInput}></input>
                </div>
                <div className={styles.linkrow1}>
                  <img src={kakao} alt="KakaoTalk" />
                  <input placeholder="카카오톡 링크 입력" type="text" onChange={onChangeInput}></input>
                </div>
                <div className={styles.linkrow1}>
                  <img src={youtube} alt="YouTube" />
                  <input placeholder="유튜브 링크 입력" type="text" onChange={onChangeInput}></input>
                </div>
                <div className={styles.linkrow1}>
                  <img src={link} alt="Link" />
                  <input placeholder="링크 입력" type="text" onChange={onChangeInput}></input>
                </div>
              </div>
            </div>
            
              <div className={styles.row}>
                <div className={styles.inputTitle}>
                  <span>소개글</span>
                  <span className={styles.required}>*</span>
                </div>
                  <textarea
                    placeholder={`리크루팅에 대한 간략한 소개\n(공백 포함 최대 300자까지 작성 가능합니다.)`}
                    className={styles.textarea}
                    rows={4}
                    onChange={onChangeInput}
                  ></textarea>
              </div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <div className={styles.createClub}>
            <span>리쿠르팅 만들기</span>
          </div>
        </div>

      </div>

        <NotEnteredModal
          open={notEnteredModalOpen}
          close={closeNotEnteredModal}
        />
        <EditCheckModal
          open={editCheckModalOpen}
          close={closeEditCheckModal}
        />
        <PageOut
          open={pageOutModalOpen}
          close={closePageOutModal}
        />

    </>
  );
}

export default CreateRecruiting;