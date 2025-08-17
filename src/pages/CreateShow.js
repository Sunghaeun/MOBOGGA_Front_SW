import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import styles from "./styles/CreateShow.module.css";
import axios from "axios";
import DELETE from "../assets/button_delete.svg";

function CreateShow() {
  const API_BASE = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [poster, setPoster] = useState(null);
  const [qr, setQr] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);
  // eslint-disable-next-line
  const [location, setLocation] = useState("");
  // eslint-disable-next-line
  const [startDate, setStartDate] = useState("");
  // eslint-disable-next-line
  const [endDate, setEndDate] = useState("");
  const [runtime, setRunTime] = useState("");
  const [managerPhoneNumber, setManagerPhoneNumber] = useState("");
  const [manager, setManager] = useState("");
  // eslint-disable-next-line
  const [maxPeople, setMaxPeople] = useState(100);
  const [accountNumber, setAccountNumber] = useState("");
  const [accouuntName, setAccountName] = useState(""); // 기존 변수명 유지 (오타 포함)
  const [accountBankName, setAccountBankName] = useState("");
  const [introductionLetter, setIntroductionLetter] = useState("");
  const [noticeLetter, setNoticeLetter] = useState("");
  const [earlyBird, setEarlyBird] = useState(false);

  // eslint-disable-next-line
  const [maxTickets, setMaxTickets] = useState("");
  // eslint-disable-next-line
  const [previewURL, setPreviewURL] = useState(null);

  // const Minus = () => {
  //   if (count > 1) setCount(count - 1);
  // };
  // const Plus = () => {
  //   if (count) setCount(count + 1);
  // };

  // 회차 배열
  const [shows, setShows] = useState([
    {
      id: Date.now(),
      order: 1,
      date: "",
      time: "",
      cost: "",
      maxTicket: 1,
      maxPeople: 100,
    },
  ]);

  // 회차 업데이트
  const updateSchedule = (id, key, value) => {
    setShows((prevShows) =>
      prevShows.map((show, index) =>
        show.id === id ? { ...show, [key]: value, order: index + 1 } : show
      )
    );
  };

  const incMaxTicket = (rowId) => {
    setShows((prev) =>
      prev.map((s) =>
        s.id === rowId ? { ...s, maxTicket: (Number(s.maxTicket) || 0) + 1 } : s
      )
    );
  };
  const decMaxTicket = (rowId) => {
    setShows((prev) =>
      prev.map((s) =>
        s.id === rowId
          ? { ...s, maxTicket: Math.max(0, (Number(s.maxTicket) || 0) - 1) }
          : s
      )
    );
  };

  /* 사진 미리보기 */
  const handlePosterChange = (e) => {
    const file = e.target.files?.[0] || null;

    // 이전 blob url 정리
    if (posterPreview?.startsWith("blob:")) URL.revokeObjectURL(posterPreview);

    setPoster(file);
    setPosterPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleQrChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (qrPreview?.startsWith("blob:")) URL.revokeObjectURL(qrPreview);

    setQr(file);
    setQrPreview(file ? URL.createObjectURL(file) : null);
  };

  // Bearer 토큰 정규화 (local ↔ session 둘 다 체크)
  const getAuthHeader = () => {
    const raw =
      window.tempToken ||
      sessionStorage.getItem("jwt") ||
      sessionStorage.getItem("idToken"); // 혹시 ID 토큰을 이렇게 저장했다면
    if (!raw) return null;
    return raw.startsWith("Bearer ") ? raw : `Bearer ${raw}`;
  };

  const makeShow = async () => {
    // 0) 필수값 검증
    const authHeader = getAuthHeader();
    if (!authHeader) {
      alert("로그인 토큰이 없습니다. 다시 로그인 해주세요.");
      return;
    }

    if (!name) return alert("제목을 입력해 주세요");
    if (!poster || !(poster instanceof File))
      return alert("공연 이미지를 선택해 주세요");
    if (!qr || !(qr instanceof File))
      return alert("송금 QR 이미지를 선택해 주세요"); // @RequestPart("qr")
    if (!location) return alert("장소를 입력해 주세요");
    if (!runtime || Number(runtime) <= 0)
      return alert("런타임을 입력해 주세요");

    for (let i = 0; i < shows.length; i++) {
      if (!shows[i].date) return alert(`${i + 1}공의 날짜를 입력해 주세요`);
      if (!shows[i].time) return alert(`${i + 1}공의 시작시간을 입력해 주세요`);
      if (!shows[i].cost || Number(shows[i].cost) <= 0)
        return alert(`${i + 1}공의 가격을 입력해 주세요`);
    }

    // 1) 시간 HH:mm -> HH:mm:ss
    const toHms = (t) => (t && t.length === 5 ? `${t}:00` : t || "");

    // 2) 서버 DTO (ShowCreateRequest)
    const requestData = {
      name,
      location,
      startDate,
      endDate,
      runtime: Number(runtime),
      manager,
      managerPhoneNumber,
      maxPeople,
      accountNumber,
      accountName: accouuntName, // 키는 정상(accountName), 상태변수명은 그대로
      accountBankName,
      introductionLetter,
      noticeLetter,
      earlyBird: Boolean(earlyBird),
      scheduleDtoList: shows.map((s, i) => ({
        id: Number(s.order) || i + 1,
        orderIndex: Number(s.order) || i + 1,
        date: s.date,
        time: toHms(s.time),
        cost: Number(s.cost),
        maxTicket: Number(s.maxTicket) || 0,
        maxPeople: Number(s.maxPeople) || 100,
      })),
    };

    // 3) FormData (파트명 정확히: poster / request / qr)
    const formData = new FormData();
    formData.append(
      "request",
      new Blob([JSON.stringify(requestData)], { type: "application/json" })
    );
    formData.append("poster", poster, "poster.jpg");
    formData.append("qr", qr, "qr.jpg");

    // 디버깅 로그
    console.log("== 최종 전송 JSON ==");
    console.log(JSON.stringify(requestData, null, 2));

    console.log("== FormData entries ==");
    for (const [k, v] of formData.entries()) {
      if (v instanceof File) {
        console.log(k, "-> File", { name: v.name, size: v.size, type: v.type });
        // eslint-disable-next-line
      } else {
        // eslint-disable-next-line

        // request는 Blob이라 바로 못 봄. 서버가 받는 건 JSON 문자열이므로 확인용:
        if (k === "request" && v instanceof Blob) {
          v.text().then((t) => console.log("request(json) ->", t));
        } else {
          console.log(k, "->", v);
        }
      }
    }

    const urlCreate = `${API_BASE}/manager/show/create`; // /api 붙이지 않음
    console.log("[DEBUG] POST URL:", urlCreate);

    try {
      const resp = await axios.post(urlCreate, formData, {
        headers: {
          Authorization: authHeader, // ★ 반드시 Bearer 접두어 포함
          // Content-Type: 지정 X (axios가 boundary 자동 설정)
        },
      });

      console.log("저장 성공", resp.data);
      const { publicId, showId, id } = resp.data || {};
      const detailId = publicId ?? showId ?? id;
      if (detailId) {
        navigate(`/show/${detailId}`);
      } else {
        alert(
          "생성은 성공했지만 상세 ID가 응답에 없습니다. 메인으로 이동합니다."
        );
        navigate("/main");
      }
    } catch (error) {
      console.error("저장 오류", error);

      if (error?.response?.status === 401) {
        console.log(
          "[401] Authorization 헤더 유무/형식, 토큰 만료(exp)/aud/iss, 또는 권한(ROLE) 확인 필요"
        );
      }

      alert(
        `저장 실패: ${
          error.response?.data?.message || error.message || "알 수 없는 오류"
        }`
      );
    }
  };

  const handlename = (e) => {
    if (e.target.value.length <= 30) setName(e.target.value);
    else alert("30글자를 초과할 수 없습니다.");
  };

  const handleIntro = (e) => {
    if (e.target.value.length <= 100) setIntroductionLetter(e.target.value);
    else alert("100자를 초과할 수 없습니다.");
  };

  const handleNotice = (e) => {
    if (e.target.value.length <= 300) setNoticeLetter(e.target.value);
    else alert("300자를 초과할 수 없습니다.");
  };

  const handleAddRow = () => {
    setShows((prev) => {
      const next = [
        ...prev,
        {
          id: Date.now(),
          order: prev.length + 1,
          date: "",
          time: "",
          cost: "",
          maxTicket: 1,
          maxPeople: 100,
        },
      ];
      // 혹시 모를 불일치 방지용 reindex
      return next.map((s, i) => ({ ...s, order: i + 1 }));
    });
  };

  const handleRemoveRow = (id) => {
    setShows((prev) =>
      prev.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i + 1 }))
    );
  };

  return (
    <div>
      <div className={styles.CreateBody}>
        <div className={styles.headText}>공연 새로 만들기</div>
        <div className={styles.Create_Container}>
          <div className={styles.Detail_Entire_Box}>
            <div className={styles.SImage_Box_Entire}>
              <div className={styles.SImage_Box}>
                <img src={posterPreview || ""} alt="미리보기" />
              </div>
              <label className={styles.inputFileLabel} htmlFor="inputFile">
                이미지 추가
                <input
                  className={styles.inputFile}
                  type="file"
                  id="inputFile"
                  accept="image/*"
                  onChange={handlePosterChange}
                />
              </label>
            </div>

            <div className={styles.entir_Boxs}>
              <div className={styles.smallInfo} style={{ color: "#D50024" }}>
                *송금QR외 모든 정보는 필수입력사항입니다.
              </div>
              <div className={styles.infos}>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>공연이름</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <input
                      type="text"
                      placeholder="공연 이름(공백포함 최대 30자까지 작성 가능합니다.)"
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
                      placeholder={`공연에 대한 간략한 소개\n(공백포함 최대 100자까지 작성 가능합니다.)`}
                      onChange={handleIntro}
                      style={{ height: "6rem", width: "27rem" }}
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
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      {"     "}~{"     "}
                      <input
                        id={styles.form_detail_date}
                        type="date"
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </span>
                </div>
                <div className={styles.smallInfo}>
                  *하루만 진행할 경우 같은 날짜로 선택해주세요
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>장소</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <input
                      type="text"
                      placeholder="공연 장소"
                      onChange={(e) => setLocation(e.target.value)}
                      style={{ width: "10.75rem" }}
                    />
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>러닝타임</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <input
                      type="number"
                      placeholder="000"
                      onChange={(e) => setRunTime(e.target.value)}
                      style={{ width: "4rem" }}
                    />
                  </span>
                  <span>분</span>
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
                        onChange={(e) => setManager(e.target.value)}
                        style={{ width: "4.75rem" }}
                      />
                      <input
                        type="text"
                        placeholder="연락처(전화번호 혹은 이메일)"
                        onChange={(e) => setManagerPhoneNumber(e.target.value)}
                        style={{ width: "21rem" }}
                      />
                    </div>
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>입금계좌</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <div className={styles.bank}>
                      <select
                        onChange={(e) => setAccountBankName(e.target.value)}
                        style={{ width: "8rem" }}
                      >
                        <option value="">OO은행</option>
                        <option value="농협">농협</option>
                        <option value="하나">하나</option>
                        <option value="신한">신한</option>
                        <option value="현대">현대</option>
                        <option value="카카오">카카오</option>
                        <option value="토스">토스</option>
                      </select>
                      <input
                        type="text"
                        placeholder="'-'없이 숫자만 입력"
                        onChange={(e) => setAccountNumber(e.target.value)}
                        style={{ width: "11.75rem" }}
                      />
                      <input
                        type="text"
                        placeholder="예금주"
                        onChange={(e) => setAccountName(e.target.value)}
                        style={{ width: "4.75rem" }}
                      />
                    </div>
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>송금QR</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <div className={styles.qr}>
                      {/* QR 미리보기 */}
                      {qrPreview && (
                        <img
                          src={qrPreview}
                          alt="QR 미리보기"
                          style={{
                            maxWidth: 160,
                            maxHeight: 160,
                            display: "block",
                            marginBottom: 8,
                          }}
                        />
                      )}
                      <label
                        className={styles.inputQrFileLabel}
                        htmlFor="inputQrFile"
                      >
                        파일 올리기
                      </label>
                      <input
                        className={styles.inputFile}
                        type="file"
                        id="inputQrFile" // ★ 라벨과 동일
                        accept="image/*"
                        onChange={handleQrChange}
                        style={{ display: "none" }}
                      />
                    </div>
                  </span>
                </div>
                <div className={styles.smallInfo}>
                  *송금QR이 필요한 경우 파일을 올려주세요
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>공지</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <textarea
                      type="text"
                      placeholder={`티켓 수령 장소, 환불 방법 및 기간, 에티켓 등 작성\n(공백 포함 최대 300백자까지 작성 가능합니다.)`}
                      onChange={handleNotice}
                      style={{ width: "27rem", height: "16rem" }}
                    />
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>얼리버드</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <label className={styles.radio}>
                      <input
                        type="radio"
                        name="earlyBird"
                        value="true"
                        checked={earlyBird === true}
                        onChange={() => setEarlyBird(true)}
                        className={styles.radioInput}
                      />
                      예
                    </label>
                    <label
                      className={styles.radio}
                      style={{ marginLeft: "1rem" }}
                    >
                      <input
                        type="radio"
                        name="earlyBird"
                        value="false"
                        checked={earlyBird === false}
                        onChange={() => setEarlyBird(false)}
                      />
                      아니요
                    </label>
                  </span>
                </div>
                <div className={styles.smallInfo}>
                  *얼리버드 티켓 할인 유무를 선택해주세요
                </div>
              </div>
            </div>
          </div>

          <div className={styles.Each_show_All}>
            <div className={styles.Each_shows}>공연 회차 만들기</div>

            <div className={styles.Each_shows_Name}>
              <div className={styles.form}>회차</div>
              <div>날짜</div>
              <div>시간</div>
              <div>구매제한매수</div>
              <div>가격</div>
              <div>회차추가</div>
              <div>삭제</div>
            </div>

            {shows.map((show, idx) => (
              <div key={show.id} className={styles.Detail_show}>
                <div className={styles.shows_line}>{idx + 1}공</div>
                <div className={styles.form_detail_date_2}>
                  <input
                    id={styles.form_detail_date}
                    type="date"
                    value={show.date || ""}
                    onChange={(e) =>
                      updateSchedule(show.id, "date", e.target.value)
                    }
                  />
                </div>
                <div className={styles.form_detail_time_2}>
                  <input
                    id={styles.form_detail_time}
                    type="time"
                    value={show.time || ""}
                    onChange={(e) =>
                      updateSchedule(show.id, "time", e.target.value)
                    }
                  />
                </div>
                <div className={styles.form_detail_number}>
                  <button
                    className={styles.ticket_Btn}
                    onClick={() => decMaxTicket(show.id)}
                  >
                    -
                  </button>
                  <span className={styles.ticket_Count}>
                    {show.maxTicket ?? 0}
                  </span>
                  <button
                    className={styles.ticket_Btn}
                    onClick={() => incMaxTicket(show.id)}
                  >
                    +
                  </button>
                </div>
                <div className={styles.form_detail_price_2}>
                  <input
                    className={styles.form_detail_price}
                    type="number"
                    value={show.cost || ""}
                    placeholder="0000"
                    onChange={(e) =>
                      updateSchedule(show.id, "cost", e.target.value)
                    }
                  />
                  원
                </div>
                <div className={styles.add_show} onClick={handleAddRow}>
                  추가
                </div>
                <div className={styles.delete_Btn}>
                  <button onClick={() => handleRemoveRow(show.id)}>
                    <img src={DELETE} alt="delete"></img>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <button className={styles.make_show_submit} onClick={makeShow}>
              공연 만들기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateShow;
