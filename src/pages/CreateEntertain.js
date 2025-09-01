import { useNavigate } from "react-router-dom";
// eslint-disable-next-line
import React, { useState, useEffect, useRef } from "react";
import useAuthStore from "../stores/authStore";
import styles from "./styles/CreateEntertain.module.css";
import apiClient from "../utils/apiClient"; // axios 대신 apiClient 사용// eslint-disable-next-line
// eslint-disable-next-line
import axios from "axios";
// eslint-disable-next-line
import Modal from "../components/Modal";
import INSTA from "../assets/icons/instagram.svg";
import KAKAO from "../assets/icons/kakao.svg";
import YOUTUBE from "../assets/icons/youtube.svg";
import LINK from "../assets/icons/linkicons.svg";
import Dropdown from "../components/Dropdown";
import POSTER from "../assets/Poster.svg";

function CreateEntertain() {
  // eslint-disable-next-line
  const API_BASE = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");

  const navigate = useNavigate();
  // eslint-disable-next-line
  const { isLoggedIn, isManager, token } = useAuthStore(); // zustand store 사용

  const [name, setName] = useState("");
  const [poster, setPoster] = useState(null);
  const [location, setLocation] = useState("");
  const [introductionLetter, setIntroductionLetter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeList, setTimeList] = useState("");
  const [manager, setManager] = useState("");
  const [managerPhoneNumber, setManagerPhone] = useState("");
  const [etcInfo, setEtcInfo] = useState("");
  const [category, setCategory] = useState("");
  const [inUrl, setInUrl] = useState("");
  const [kakaUrl, setKakaUrl] = useState("");
  const [youUrl, setYouUrl] = useState("");
  const [url, setUrl] = useState("");

  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [imgModalOpen, setImgModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [startDateModalOpen, setStartDateModalOpen] = useState(false);
  const [endDateModalOpen, setEndDateModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [failedModalOpen, setFailedModalOpen] = useState(false);
  const [nameLimitModalOpen, setNameLimitModalOpen] = useState(false);
  const [introLimitModalOpen, setIntroLimitModalOpen] = useState(false);
  const [contentLimitModalOpen, setContentLimitModalOpen] = useState(false);

  const nameOkRef = useRef(null);
  const imgOkRef = useRef(null);
  const locationOkRef = useRef(null);
  const startDateOkRef = useRef(null);
  const endDateOkRef = useRef(null);
  const saveOkRef = useRef(null);
  const failedOkRef = useRef(null);
  const nameLimitOkRef = useRef(null);
  const introLimitOkRef = useRef(null);
  const contentLimitOkRef = useRef(null);

  const [previewURL, setPreviewURL] = useState(null);

  /* 사진 미리보기 기능 */
  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPoster(file);
      setPreviewURL(URL.createObjectURL(file)); //미리 보기 url 생성
    } else {
    }
  };

  //모든 입력란을 받아야 submit 가능 + 빈칸이 어디인지 알려줌
  const makeEntertain = async () => {
    // 권한 체크
    if (!isLoggedIn || !isManager) {
      alert("로그인이 필요하거나 권한이 없습니다.");
      navigate("/login");
      return;
    }

    // 필수값 검증
    if (!name) return setNameModalOpen(true);
    if (!poster || !(poster instanceof File)) {
      return setImgModalOpen(true);
    }
    if (!location) return setLocationModalOpen(true);
    if (!startDate) return setStartDateModalOpen(true);
    if (!endDate) return setEndDateModalOpen(true);

    const requestData = {
      name,
      introductionLetter,
      category,
      location,
      startDate,
      endDate,
      timeList,
      manager,
      managerPhoneNumber,
      etcInfo,
      inUrl,
      kakaUrl,
      youUrl,
      url,
    };

    const formData = new FormData();
    formData.append("poster", poster);
    formData.append(
      "request",
      new Blob([JSON.stringify(requestData)], { type: "application/json" })
    );

    try {
      const response = await apiClient.post(
        "/manager/entertain/create",
        formData
      );

      const { publicId, showId, id } = response.data || {};
      const detailId = publicId ?? showId ?? id;

      if (detailId) {
        navigate(`/entertain/${detailId}`);
      } else {
        setSaveModalOpen(true);
        navigate("/main");
      }
    } catch (error) {
      setFailedModalOpen(true);
    }
  };

  //제목 글자 수 limit
  const handlename = (e) => {
    if (e.target.value.length <= 30) {
      setName(e.target.value);
    } else {
      setNameLimitModalOpen(true);
    }
  };

  const handleIntro = (e) => {
    if (e.target.value.length <= 100) {
      setIntroductionLetter(e.target.value);
    } else {
      setIntroLimitModalOpen(true);
    }
  };

  // 공연 소개란 limit
  const handleContent = (e) => {
    if (e.target.value.length <= 300) {
      setEtcInfo(e.target.value);
    } else {
      setContentLimitModalOpen(true);
    }
  };

  return (
    <div>
      <div className={styles.CreateBody}>
        <div className={styles.headText}>행사 새로 만들기</div>
        <div className={styles.Create_Container}>
          <div className={styles.Detail_Entire_Box}>
            <div className={styles.SImage_Box_Entire}>
              <div className={styles.SImage_Box}>
                <img src={previewURL || POSTER} alt="미리보기" />
              </div>
              <label className={styles.inputFileLabel} htmlFor="inputFile">
                이미지 추가
                <input
                  className={styles.inputFile}
                  type="file"
                  id="inputFile"
                  accept="image/*"
                  onChange={handleImg}
                />
              </label>
            </div>

            <div className={styles.entir_Boxs}>
              <div className={styles.infos}>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>
                      제목<span className={styles.required}>*</span>
                    </span>
                  </span>
                  <span className={styles.variable_Info}>
                    <input
                      type="text"
                      placeholder="행사 이름(공백포함 최대 30자까지 작성 가능합니다.)"
                      value={name}
                      onChange={handlename}
                    />
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>
                      소개글<span className={styles.required}>*</span>
                    </span>
                  </span>
                  <span className={styles.variable_Info}>
                    <textarea
                      type="text"
                      placeholder={`행사에 대한 간략한 소개\n(공백포함 최대 100자까지 작성 가능합니다.)`}
                      onChange={handleIntro}
                      style={{ height: "6rem" }}
                    />
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>카테고리</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <Dropdown
                      defaultValue="카테고리"
                      value={category}
                      options={[
                        "카테고리",
                        "체험",
                        "스트릿공연",
                        "먹거리",
                        "예배",
                      ]}
                      onChange={(val) => setCategory(val)}
                    />
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>장소</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <input
                      type="text"
                      placeholder="진행 장소"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <div className={styles.fixed_Info}>
                    <span className={styles.info_txt}>
                      날짜<span className={styles.required}>*</span>
                    </span>
                  </div>
                  <div className={styles.variable_Info}>
                    <div className={styles.form_detail_date_2}>
                      <input
                        id={styles.form_detail_date}
                        type="date"
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      {"     "}~{"     "}
                      <input
                        id={styles.form_detail_date}
                        type="date"
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <div className={styles.smallInfo}>
                      하루만 진행할 경우 같은 날짜로 선택해주세요
                    </div>
                  </div>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>시간</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <input
                      type="text"
                      placeholder={`시간 입력`}
                      onChange={(e) => setTimeList(e.target.value)}
                    />
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>
                      담당자<span className={styles.required}>*</span>
                    </span>
                  </span>
                  <span
                    className={styles.variable_Info}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "23% 74%",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="이름"
                      onChange={(e) => setManager(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="전화번호"
                      onChange={(e) => setManagerPhone(e.target.value)}
                      style={{ marginLeft: "1rem" }}
                    />
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>
                      기타정보<span className={styles.required}>*</span>
                    </span>
                  </span>
                  <span className={styles.variable_Info}>
                    <textarea
                      type="text"
                      placeholder={`상세일정, 가격, 예약 방법 등 추가 정보 입력\n(공백 포함 최대 500자까지 입력 가능합니다.)`}
                      onChange={handleContent}
                      style={{ height: "26rem" }}
                    />
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>관련링크</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <div className={styles.sns}>
                      <span className={styles.sns_icon}>
                        <img src={INSTA} alt="sns_icon" />
                      </span>
                      <span className={styles.variable_Info}>
                        <input
                          type="text"
                          placeholder="인스타그램 링크 입력"
                          className={styles.sns_link}
                          onChange={(e) => setInUrl(e.target.value)}
                        ></input>
                      </span>
                    </div>
                    <div className={styles.sns}>
                      <span className={styles.sns_icon}>
                        <img src={KAKAO} alt="sns_icon" />
                      </span>
                      <span className={styles.variable_Info}>
                        <input
                          type="text"
                          placeholder="카카오톡 오픈채팅방 또는 채널 링크 입력"
                          className={styles.sns_link}
                          onChange={(e) => setKakaUrl(e.target.value)}
                        ></input>
                      </span>
                    </div>
                    <div className={styles.sns}>
                      <span className={styles.sns_icon}>
                        <img src={YOUTUBE} alt="sns_icon" />
                      </span>
                      <span className={styles.variable_Info}>
                        <input
                          type="text"
                          placeholder="유튜브 링크 입력"
                          className={styles.sns_link}
                          onChange={(e) => setYouUrl(e.target.value)}
                        ></input>
                      </span>
                    </div>
                    <div className={styles.sns}>
                      <span className={styles.sns_icon}>
                        <img src={LINK} alt="sns_icon" />
                      </span>
                      <span className={styles.variable_Info}>
                        <input
                          type="text"
                          placeholder="구글 폼, 페이스북 등의 링크 입력"
                          className={styles.sns_link}
                          onChange={(e) => setUrl(e.target.value)}
                        ></input>
                      </span>
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button className={styles.make_show_submit} onClick={makeEntertain}>
              생성하기
            </button>
          </div>
        </div>
        {/* 제목 모달 */}
        <Modal
          className={null}
          isOpen={nameModalOpen}
          onClose={() => setNameModalOpen(false)}
        >
          <div className={styles.modal_con}>제목을 입력해주세요.</div>
          <div className={styles.modal_Btns}>
            <button
              type="button"
              ref={nameOkRef}
              autoFocus
              className={styles.modal_reserv_Btn}
              onClick={() => setNameModalOpen(false)}
            >
              확인
            </button>
          </div>
        </Modal>
        {/* img 모달 */}
        <Modal
          className={null}
          isOpen={imgModalOpen}
          onClose={() => setImgModalOpen(false)}
        >
          <div className={styles.modal_con}>행사 포스터를 선택해주세요</div>
          <div className={styles.modal_Btns}>
            <button
              type="button"
              ref={imgOkRef}
              autoFocus
              className={styles.modal_reserv_Btn}
              onClick={() => setImgModalOpen(false)}
            >
              확인
            </button>
          </div>
        </Modal>
        {/* 장소 모달 */}
        <Modal
          className={null}
          isOpen={locationModalOpen}
          onClose={() => setLocationModalOpen(false)}
        >
          <div className={styles.modal_con}>장소를 입력해주세요</div>
          <div className={styles.modal_Btns}>
            <button
              type="button"
              ref={locationOkRef}
              autoFocus
              className={styles.modal_reserv_Btn}
              onClick={() => setLocationModalOpen(false)}
            >
              확인
            </button>
          </div>
        </Modal>
        {/* 시작날짜 모달 */}
        <Modal
          className={null}
          isOpen={startDateModalOpen}
          onClose={() => setStartDateModalOpen(false)}
        >
          <div className={styles.modal_con}>시작날짜를 입력해주세요</div>
          <div className={styles.modal_Btns}>
            <button
              type="button"
              ref={startDateOkRef}
              autoFocus
              className={styles.modal_reserv_Btn}
              onClick={() => setStartDateModalOpen(false)}
            >
              확인
            </button>
          </div>
        </Modal>
        {/* 끝 날짜 모달 */}
        <Modal
          className={null}
          isOpen={endDateModalOpen}
          onClose={() => setEndDateModalOpen(false)}
        >
          <div className={styles.modal_con}>종료 날짜를 입력해주세요</div>
          <div className={styles.modal_Btns}>
            <button
              type="button"
              ref={endDateOkRef}
              autoFocus
              className={styles.modal_reserv_Btn}
              onClick={() => setEndDateModalOpen(false)}
            >
              확인
            </button>
          </div>
        </Modal>
        {/* 저장 성공 모달 */}
        <Modal
          className={null}
          isOpen={saveModalOpen}
          onClose={() => setSaveModalOpen(false)}
        >
          <div className={styles.modal_con}>행사가 저장되었습니다.</div>
          <div className={styles.modal_Btns}>
            <button
              type="button"
              ref={saveOkRef}
              autoFocus
              className={styles.modal_reserv_Btn}
              onClick={() => setSaveModalOpen(false)}
            >
              확인
            </button>
          </div>
        </Modal>
        {/* 저장 실패 모달 */}
        <Modal
          className={null}
          isOpen={failedModalOpen}
          onClose={() => setFailedModalOpen(false)}
        >
          <div className={styles.modal_con}>저장 실패</div>
          <div className={styles.modal_Btns}>
            <button
              type="button"
              ref={failedOkRef}
              autoFocus
              className={styles.modal_reserv_Btn}
              onClick={() => setFailedModalOpen(false)}
            >
              확인
            </button>
          </div>
        </Modal>
        {/* 이름 길이 제한 모달 */}
        <Modal
          className={null}
          isOpen={nameLimitModalOpen}
          onClose={() => setNameLimitModalOpen(false)}
        >
          <div className={styles.modal_con}>30글자를 초과할 수 없습니다.</div>
          <div className={styles.modal_Btns}>
            <button
              type="button"
              ref={nameLimitOkRef}
              autoFocus
              className={styles.modal_reserv_Btn}
              onClick={() => setNameLimitModalOpen(false)}
            >
              확인
            </button>
          </div>
        </Modal>
        {/* 소개란 길이 제한 모달 */}
        <Modal
          className={null}
          isOpen={introLimitModalOpen}
          onClose={() => setIntroLimitModalOpen(false)}
        >
          <div className={styles.modal_con}>100글자를 초과할 수 없습니다.</div>
          <div className={styles.modal_Btns}>
            <button
              type="button"
              ref={introLimitOkRef}
              autoFocus
              className={styles.modal_reserv_Btn}
              onClick={() => setIntroLimitModalOpen(false)}
            >
              확인
            </button>
          </div>
        </Modal>
        {/* 공지 길이 제한 모달 */}
        <Modal
          className={null}
          isOpen={contentLimitModalOpen}
          onClose={() => setContentLimitModalOpen(false)}
        >
          <div className={styles.modal_con}>300글자를 초과할 수 없습니다.</div>
          <div className={styles.modal_Btns}>
            <button
              type="button"
              ref={contentLimitOkRef}
              autoFocus
              className={styles.modal_reserv_Btn}
              onClick={() => setContentLimitModalOpen(false)}
            >
              확인
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default CreateEntertain;
