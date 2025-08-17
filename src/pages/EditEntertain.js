import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import styles from "./styles/CreateEntertain.module.css";
import axios from "axios";
import INSTA from "../assets/icons/instagram.svg";
import KAKAO from "../assets/icons/kakao.svg";
import YOUTUBE from "../assets/icons/youtube.svg";
import NOTION from "../assets/icons/notion.svg";
import LINK from "../assets/icons/linkicons.svg";

function EditEntertain() {
  const API_BASE = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [poster, setPoster] = useState(null); // 새로 업로드한 파일
  const [posterUrl, setPosterUrl] = useState(""); // 서버에 저장된 이미지 URL
  const [previewURL, setPreviewURL] = useState(null); // 실제 미리보기(파일 > 서버URL)

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
  const [noUrl, setNoUrl] = useState("");
  const [url, setUrl] = useState("");

  // 파일 미리보기
  const handleImg = (e) => {
    const file = e.target.files?.[0] || null;

    // 이전 blob URL 정리
    if (previewURL?.startsWith("blob:")) URL.revokeObjectURL(previewURL);

    setPoster(file);
    // 새 파일 있으면 그걸로, 아니면 서버 URL 유지
    setPreviewURL(file ? URL.createObjectURL(file) : posterUrl || null);
  };

  // 공통: 토큰 헤더 만들기
  const getAuthHeader = () => {
    const raw =
      window.tempToken ||
      sessionStorage.getItem("jwt") ||
      sessionStorage.getItem("idToken");
    if (!raw) return null;
    return raw.startsWith("Bearer ") ? raw : `Bearer ${raw}`;
  };

  const getEntertain = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        alert("로그인 필요");
        return;
      }

      const res = await axios.get(
        `${API_BASE}/manager/entertain/update/${id}`,
        {
          headers: { Authorization: `Baereer ${token}` },
        }
      );
      console.log("== 서버에서 받은 데이터 ==", res.data);

      const src = res.data ?? {};
      setName(src.name ?? "");
      setIntroductionLetter(src.introductionLetter ?? "");
      setCategory(src.category ?? "");
      setLocation(src.location ?? "");
      setStartDate(src.startDate ?? "");
      setEndDate(src.endDate ?? "");
      setManager(src.manager ?? "");
      setManagerPhone(src.managerPhoneNumber ?? "");
      setInUrl(src.inUrl ?? "");
      setKakaUrl(src.kakaUrl ?? "");
      setYouUrl(src.youUrl ?? "");
      setNoUrl(src.noUrl ?? "");
      setUrl(src.url ?? "");
      setTimeList(src.timeList ?? "");
      setEtcInfo(src.etcInfo ?? "");

      // 서버 이미지 URL 필드명에 맞춰 세팅 (photo/posterUrl 등)
      const serverPoster = src.poster || src.posterUrl || "";
      setPosterUrl(serverPoster);
      setPreviewURL(serverPoster || null);
    } catch (err) {
      console.error("즐길거리 데이터 로드 실패", err);
      alert("데이터 로드에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (id) getEntertain();
    // 언마운트 시 blob URL 정리
    return () => {
      if (previewURL?.startsWith("blob:")) URL.revokeObjectURL(previewURL);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateEntertain = async () => {
    const auth = getAuthHeader();
    if (!auth) {
      alert("로그인 필요");
      return;
    }

    // 필수값 체크 (포스터는 선택)
    if (!name) return alert("제목을 입력해 주세요");
    if (!location) return alert("장소를 입력해 주세요");
    if (!startDate) return alert("시작날짜를 입력해 주세요");
    if (!endDate) return alert("끝 날짜를 입력해 주세요");

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
      noUrl,
      url,
    };

    const formData = new FormData();
    // 서버가 "poster"라는 파트명을 기대한다고 가정 (필요시 변경)
    if (poster instanceof File) {
      formData.append("poster", poster, poster.name || "poster.jpg");
    }
    formData.append(
      "request",
      new Blob([JSON.stringify(requestData)], { type: "application/json" })
    );

    const endpoint = `${API_BASE}/manager/entertain/update/${id}`;

    // 디버깅 로그
    console.log("== 최종 전송 JSON ==", JSON.stringify(requestData, null, 2));
    console.log("== FormData entries ==");
    for (const [k, v] of formData.entries()) {
      if (v instanceof File) {
        console.log(k, "-> File", { name: v.name, size: v.size, type: v.type });
      } else if (k === "request" && v instanceof Blob) {
        v.text().then((t) => console.log("request(json) ->", t));
      } else {
        console.log(k, "->", v);
      }
    }

    try {
      await axios.put(endpoint, formData, {
        headers: { Authorization: auth }, // Content-Type 생략: axios가 boundary 자동 지정
      });
      alert("즐길거리 수정 완료");
      navigate(`/entertain/${id}`);
    } catch (error) {
      console.error("저장 오류", error);
      alert(`저장 실패: ${error.response?.data?.message || "알 수 없는 오류"}`);
    }
  };

  //제목 글자 수 limit
  const handlename = (e) => {
    if (e.target.value.length <= 30) setName(e.target.value);
    else alert("30글자를 초과할 수 없습니다.");
  };

  const handleIntro = (e) => {
    if (e.target.value.length <= 100) setIntroductionLetter(e.target.value);
    else alert("100자를 초과할 수 없습니다.");
  };

  const handleContent = (e) => {
    if (e.target.value.length <= 300) setEtcInfo(e.target.value);
    else alert("300자를 초과할 수 없습니다.");
  };

  return (
    <div>
      <div className={styles.CreateBody}>
        <div className={styles.headText}>즐길거리 수정하기</div>
        <div className={styles.Create_Container}>
          <div className={styles.Detail_Entire_Box}>
            {/* 포스터 박스 */}
            <div className={styles.SImage_Box_Entire}>
              <div className={styles.SImage_Box}>
                <img
                  src={
                    previewURL ||
                    "https://via.placeholder.com/300x400?text=Poster"
                  }
                  alt="미리보기"
                />
              </div>
              <label className={styles.inputFileLabel} htmlFor="entPosterFile">
                이미지 추가
                <input
                  className={styles.inputFile}
                  type="file"
                  id="entPosterFile"
                  accept="image/*"
                  onChange={handleImg}
                />
              </label>
            </div>

            <div className={styles.entir_Boxs}>
              <div className={styles.infos}>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>제목</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <input
                      type="text"
                      placeholder="즐길거리 이름(공백포함 최대 30자까지 작성 가능합니다.)"
                      value={name}
                      onChange={handlename}
                      style={{ width: "27rem" }}
                    />
                  </span>
                </div>

                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>소개글</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <textarea
                      type="text"
                      placeholder={`즐길거리에 대한 간략한 소개\n(공백포함 최대 100자까지 작성 가능합니다.)`}
                      value={introductionLetter}
                      onChange={handleIntro}
                      style={{ height: "6rem", width: "27rem" }}
                    />
                  </span>
                </div>

                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>카테고리</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">선택</option>
                      <option value="공연">공연</option>
                      <option value="체험">체험</option>
                      <option value="스트릿공연">스트릿공연</option>
                      <option value="먹거리">먹거리</option>
                      <option value="예배">예배</option>
                    </select>
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
                      style={{ width: "27rem" }}
                    />
                  </span>
                </div>

                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>날짜</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <div className={styles.form_detail_date_2}>
                      <input
                        id={styles.form_detail_date}
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      ~
                      <input
                        id={styles.form_detail_date}
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <div className={styles.smallInfo}>
                      하루만 진행할 경우 같은 날짜로 선택해주세요
                    </div>
                  </span>
                </div>

                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>시간</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <input
                      type="text"
                      placeholder={`시간 입력`}
                      value={timeList}
                      onChange={(e) => setTimeList(e.target.value)}
                      style={{ width: "27rem" }}
                    />
                  </span>
                </div>

                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>담당자</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <div className={styles.manager}>
                      <input
                        type="text"
                        placeholder="이름"
                        value={manager}
                        style={{ width: "4.75rem" }}
                        onChange={(e) => setManager(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="연락처(전화번호 혹은 이메일)"
                        value={managerPhoneNumber}
                        style={{ width: "21rem" }}
                        onChange={(e) => setManagerPhone(e.target.value)}
                      />
                    </div>
                  </span>
                </div>

                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>기타정보</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <textarea
                      type="text"
                      placeholder={`상세일정, 가격, 예약 방법 등 추가 정보 입력\n(공백 포함 최대 500자까지 입력 가능합니다.)`}
                      value={etcInfo}
                      onChange={handleContent}
                      style={{ width: "27rem", height: "16rem" }}
                    />
                  </span>
                </div>

                {/* 링크들 */}
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
                          style={{ width: "22rem" }}
                          value={inUrl}
                          className={styles.sns_link}
                          onChange={(e) => setInUrl(e.target.value)}
                        />
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
                          style={{ width: "22rem" }}
                          value={kakaUrl}
                          className={styles.sns_link}
                          onChange={(e) => setKakaUrl(e.target.value)}
                        />
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
                          style={{ width: "22rem" }}
                          value={youUrl}
                          className={styles.sns_link}
                          onChange={(e) => setYouUrl(e.target.value)}
                        />
                      </span>
                    </div>
                    <div className={styles.sns}>
                      <span className={styles.sns_icon}>
                        <img src={NOTION} alt="sns_icon" />
                      </span>
                      <span className={styles.variable_Info}>
                        <input
                          type="text"
                          placeholder="노션(Notion) 링크 입력"
                          style={{ width: "22rem" }}
                          value={noUrl}
                          className={styles.sns_link}
                          onChange={(e) => setNoUrl(e.target.value)}
                        />
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
                          style={{ width: "22rem" }}
                          value={url}
                          className={styles.sns_link}
                          onChange={(e) => setUrl(e.target.value)}
                        />
                      </span>
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              className={styles.make_show_submit}
              onClick={updateEntertain}
            >
              즐길거리 업데이트
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditEntertain;
